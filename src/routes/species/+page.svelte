<script lang="ts">
  import SwipableList from "$lib/components/generic/SwipableList.svelte";

  const species = [1, 3, 4, 5]

  const deleteSpecies = (index: number) => {
    species.splice(index, 1)
  }
</script>

{#snippet display(number: number)}
  <div>
    <span>The number is {number}</span>
  </div>
{/snippet}

<SwipableList items={species} deleteItem={deleteSpecies}  />