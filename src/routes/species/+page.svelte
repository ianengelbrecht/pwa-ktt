<script lang="ts">
  import { goto } from "$app/navigation";
  import SwipableList from "$lib/components/SwipableList.svelte";
  import SpeciesCard from "./SpeciesCard.svelte";
  import type { Species } from "$lib/types/types";
  import { speciesCollection } from "$lib/db/dexie"
  
  const { data } = $props();
  const { species, checklist } = data;

  const deleteSpecies = (speciesRecord: Record<string, any>) => {
    speciesCollection.where('speciesID').equals(speciesRecord.speciesID).delete().then(() => {
      const index = species.findIndex((record) => record === speciesRecord as Species);
      species.splice(index, 1);
    });
  }
  
  const deleteAllSpecies = () => {
    speciesCollection.clear().then(() => {
      species.length = 0;
    });
  }

</script>

<main id="listScreen" class="flex-1 p-4">
  <div class="mb-4">
    <h1 class="text-xl">{checklist?.checklistName || 'Oops! No checklist name...'}</h1>
  </div>
  <SwipableList items={species} deleteItem={deleteSpecies} deleteAll={deleteAllSpecies} ItemComponent={SpeciesCard}/>
  {#if !species.length}
    <button class="rounded p-2 border border-slate-200 mt-2 hover:ring" onclick={() => goto('/species/import?checklistID=' + checklist.checklistID)}>Import species</button>
  {/if}
</main>