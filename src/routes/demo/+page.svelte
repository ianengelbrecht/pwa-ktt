<script lang="ts">
  // this is outdated and does not confirm to the standard +page pattern, but it works for now and is just a demo
  import { toast } from '@zerodevx/svelte-toast';
  import BackButton from '$lib/components/BackButton.svelte';
  import SwipableList from '$lib/components/SwipableList.svelte';
  import RecordCard from './RecordCard.svelte';
  import type { CoordsRecord } from '$lib/types/types';
  import { exportCSV } from '$lib/utils';

  const data: CoordsRecord[] = $state(
    JSON.parse(localStorage.getItem('geoData') || '[]'),
  );

  const deleteItem = (item: Record<string, any>) => {
    const index = data.findIndex((record) => record === (item as CoordsRecord));
    data.splice(index, 1);
    localStorage.setItem('geoData', JSON.stringify(data));
    toast.push(`Record deleted`, {
      theme: { '--toastBackground': 'oklch(26.6% 0.079 36.259)' },
    });
  };

  const deleteAll = () => {
    data.length = 0;
    localStorage.setItem('geoData', JSON.stringify(data));
  };

  const exportData = () => {
    exportCSV(data, undefined, 'demorecords.csv');
  };
</script>

<main id="listScreen" class="flex-1 p-4 gap-2">
  <BackButton />
  <h1 class="text-xl mb-4">Some example data...</h1>
  <SwipableList
    items={data}
    {deleteItem}
    {deleteAll}
    ItemComponent={RecordCard}
    exportFunction={exportData}
  />
</main>
