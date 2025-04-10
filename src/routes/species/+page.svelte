<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import SwipableList from "$lib/components/SwipableList.svelte";
  import SpeciesCard from "./SpeciesCard.svelte";
  import type { Species } from "$lib/types/types";
  

  import { settingsCollection, speciesCollection } from "$lib/db/dexie"
  const species: Species[] = $state([]);

  let fileInput: HTMLInputElement | null = null;

  onMount(async () => {
    let checklistID = page.url.searchParams.get('checklistID') || null;
    if (!checklistID) {
      //get it from settings
      const settings = await settingsCollection.toArray()
      if (settings.length > 0) {
        checklistID = settings[0].checklist?.checklistID || null;
      }
    }
    if (!checklistID) {
      //show all species
      speciesCollection.toArray().then((speciesRecords) => {
        species.push(...speciesRecords);
      });
    }
    else {
      speciesCollection.where('checklistID').equals(checklistID).toArray().then((speciesRecords) => {
        species.push(...speciesRecords);
      });
    }
  });

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
    <h1 class="text-xl">Species</h1>
    <p class="text-xs">South African birds checklist</p> <!-- TODO, add this dunamically from settings -->
  </div>
  <SwipableList items={species} deleteItem={deleteSpecies} deleteAll={deleteAllSpecies} itemIDfield={'speciesID'} ItemComponent={SpeciesCard}/>
  {#if !species.length}
    <button class="rounded p-2 border border-slate-200 mt-2 hover:ring" onclick={() => goto('/species/import?')}>Import species</button>
    <input type="file" name="" id="" accept=".csv" bind:this={fileInput}>
  {/if}
</main>