<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import SwipableList from "$lib/components/SwipableList.svelte";
  import SpeciesCard from "./SpeciesCard.svelte";
  import type { Checklist, Species } from "$lib/types/types";
  import { speciesCollection, checklistCollection } from "$lib/db/dexie"
  
  let checklistID = page.url.searchParams.get('checklistID') || null;
  
  //we should only be able to get here from a checklist page
  if (!checklistID) {
    //redirect to  error page
    goto('/error', { replaceState: true });
  }

  const species: Species[] = $state([]);
  let checklist: Checklist | null = $state(null);
  let fileInput: HTMLInputElement | null = null;

  onMount(async () => {


    speciesCollection.where('checklistID').equals(checklistID!).toArray().then((speciesRecords) => {
      console.log('got', speciesRecords.length, 'species records');
      console.log(speciesRecords.slice(0, 5))
      speciesRecords.sort((a, b) => {
        const nameA = (a.commonName1 || '').toLowerCase();
        const nameB = (b.commonName1 || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      console.log('there are', speciesRecords.length, 'sorted species records');
      species.push(...speciesRecords);
    });

    checklistCollection.where('checklistID').equals(checklistID!).toArray().then((checklists) => {
      if (checklists.length > 0) {
        checklist = checklists[0];
      } else {
        checklist = null;
      }
    });

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
    <h1 class="text-xl">{checklist?.checklistName || 'Oops! No checklist name...'}</h1>
  </div>
  <SwipableList items={species} deleteItem={deleteSpecies} deleteAll={deleteAllSpecies} itemIDfield={'speciesID'} ItemComponent={SpeciesCard}/>
  {#if !species.length}
    <button class="rounded p-2 border border-slate-200 mt-2 hover:ring" onclick={() => goto('/species/import?checklistID=' + checklistID)}>Import species</button>
  {/if}
</main>