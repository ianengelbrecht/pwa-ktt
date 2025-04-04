<script lang="ts">
  import SwipableList from '../../lib/components/SwipableList.svelte';
  import RecordCard from '../../lib/components/RecordCard.svelte';
  import { exportCSV } from '$lib/utils';
  import type { record}  from '$lib/types/types'

  const data: record[] = $state(JSON.parse(localStorage.getItem('geoData') || '[]'))
  const nums = $state([0, 1, 2, 3, 4, 5])

  const deleteItem = (index: number) => {
    data.splice(index, 1)
    localStorage.setItem('geoData', JSON.stringify(data))
  }

  const deleteAll = () => {
    data.length = 0
    localStorage.setItem('geoData', JSON.stringify(data))
  }

</script>

<main id="listScreen" class="flex-1 p-4">
  <h1 class="text-xl mb-4">Saved Coordinates</h1>
  <SwipableList data={data} {deleteItem} ItemComponent={RecordCard} />
  <div class="flex justify-between">
    <button onclick={() => exportCSV(data)} class="mt-4 p-2 bg-green-600 rounded cursor-pointer disabled:bg-transparent disabled:cursor-auto " disabled={!data.length}>Export CSV</button>
    <button onclick={deleteAll} class="mt-4 p-2 rounded border-2 border-gray-200 cursor-pointer" >Delete all</button>
  </div>
</main>