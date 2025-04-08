<script lang="ts">
  import SwipableList from '$lib/components/generic/SwipableList.svelte';
  import RecordCard from '$lib/components/demo/RecordCard.svelte';
  import type { Record }  from '$lib/types/types'

  const data: Record[] = $state(JSON.parse(localStorage.getItem('geoData') || '[]'))

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
  <SwipableList items={data} {deleteItem} {deleteAll} ItemComponent={RecordCard} />
</main>