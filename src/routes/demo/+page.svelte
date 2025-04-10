<script lang="ts">
  import SwipableList from '$lib/components/SwipableList.svelte';
  import RecordCard from './RecordCard.svelte';
  import type { CoordsRecord }  from '$lib/types/types'

  const data: CoordsRecord[] = $state(JSON.parse(localStorage.getItem('geoData') || '[]'))

  const deleteItem = (item: Record<string, any>) => {
    const index = data.findIndex((record) => record === item as CoordsRecord)
    data.splice(index, 1)
    localStorage.setItem('geoData', JSON.stringify(data))
  }

  const deleteAll = () => {
    data.length = 0
    localStorage.setItem('geoData', JSON.stringify(data))
  }

</script>

<main id="listScreen" class="flex-1 p-4">
  <h1 class="text-xl mb-4">Some example data...</h1>
  <SwipableList items={data} {deleteItem} {deleteAll} ItemComponent={RecordCard} itemIDfield='' />
</main>