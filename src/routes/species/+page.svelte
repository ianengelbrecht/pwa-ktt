<script lang="ts">
  import { goto } from "$app/navigation";
  import SwipableList from "$lib/components/SwipableList.svelte";
  import SpeciesCard from "./SpeciesCard.svelte";
  import type { Species } from "$lib/types/types";
  import { speciesCollection } from "$lib/db/dexie"
  
  const { data } = $props();
  const { species, checklist } = data;

<<<<<<< HEAD
  let speciesList: Species[] = $state([]);
  speciesList = species;

  const deleteSpecies = async (speciesRecord: Record<string, any>) => {
    try {
      await speciesCollection.delete(speciesRecord.speciesID)
    }
    catch(err) {
      if (err instanceof Error) {
        alert('Error deleting record: ' + err.message);
      } else {
        alert('Error deleting record: ' + JSON.stringify(err));
      }
    }
    const index = speciesList.findIndex((record) => record === speciesRecord as Species);
    speciesList.splice(index, 1);
=======
  const deleteSpecies = (speciesRecord: Record<string, any>) => {
    speciesCollection.where('speciesID').equals(speciesRecord.speciesID).delete().then(() => {
      const index = species.findIndex((record) => record === speciesRecord as Species);
      species.splice(index, 1);
    });
>>>>>>> a6b69894d9963b24658bd95be19d5841e49d30d2
  }
  
  const deleteAllSpecies = () => {
    speciesCollection.clear().then(() => {
      speciesList.length = 0;
    });
  }

</script>

<main id="listScreen" class="flex-1 p-4">
  <div class="mb-4">
    <h1 class="text-2xl">Species:</h1>
    <h2 class="">{checklist?.checklistName || 'Oops! No checklist name...'}</h2>
  </div>
<<<<<<< HEAD
  <SwipableList items={speciesList} deleteItem={deleteSpecies} deleteAll={deleteAllSpecies} ItemComponent={SpeciesCard}/>
  {#if !speciesList.length}
=======
  <SwipableList items={species} deleteItem={deleteSpecies} deleteAll={deleteAllSpecies} ItemComponent={SpeciesCard}/>
  {#if !species.length}
>>>>>>> a6b69894d9963b24658bd95be19d5841e49d30d2
    <button class="rounded p-2 border border-slate-200 mt-2 hover:ring" onclick={() => goto('/species/import?checklistID=' + checklist.checklistID)}>Import species</button>
  {/if}
</main>