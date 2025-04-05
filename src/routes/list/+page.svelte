<script lang="ts">
  import SwipableList from '../../lib/components/SwipableList.svelte';
  import RecordCard from '../../lib/components/RecordCard.svelte';
  import type { record }  from '$lib/types/types'

  const data: record[] = $state(JSON.parse(localStorage.getItem('geoData') || '[]'))

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
  <SwipableList data={data} {deleteItem} {deleteAll} ItemComponent={RecordCard} />
</main>