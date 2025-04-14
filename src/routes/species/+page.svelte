<script lang="ts">
  import { goto } from '$app/navigation';
  import SwipableList from '$lib/components/SwipableList.svelte';
  import SpeciesCard from './SpeciesCard.svelte';
  import type { Species } from '$lib/types/types';
  import { speciesCollection } from '$lib/db/dexie';

  const { data } = $props();
  const { species, checklist } = data;

  const deleteSpecies = async (speciesRecord: Record<string, any>) => {
    try {
      await speciesCollection.delete(speciesRecord.speciesID)
    }
    catch (err) {
      if (err instanceof Error) {
        alert('Error deleting record: ' + err.message);
      }
      else {
        alert('Error deleting record: ' + err);
      }
      return
    }

    const index = species.findIndex((record) => record === (speciesRecord as Species));
    if (index !== -1) {
      species.splice(index, 1);
    }
  };

  const deleteAllSpecies = async () => {
    try {
      await speciesCollection.clear();
    }
    catch (err) {
      if (err instanceof Error) {
        alert('Error deleting all records: ' + err.message);
      }
      else {
        alert('Error deleting all records: ' + err);
      }
      return  
    }
    species.length = 0;
  };
</script>

<main id="listScreen" class="flex-1 p-4">
  <div class="mb-4">
    <h1 class="text-2xl">Species:</h1>
    <h2 class="">{checklist?.checklistName || 'Oops! No checklist name...'}</h2>
  </div>
  <SwipableList
    items={species}
    deleteItem={deleteSpecies}
    deleteAll={deleteAllSpecies}
    ItemComponent={SpeciesCard}
  />
  {#if !species.length}
    <button
      class="rounded p-2 border border-slate-200 mt-2 hover:ring"
      onclick={() =>
        goto('/species/import?checklistID=' + checklist.checklistID)}
      >Import species</button
    >
  {/if}
</main>
