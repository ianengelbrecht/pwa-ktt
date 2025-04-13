<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast"
  import { page } from "$app/state";
  import { makeID } from '$lib/utils';
  import type { Species }  from '$lib/types/types';
  import { speciesCollection, checklistCollection } from "$lib/db/dexie";
  import BirdSpeciesForm from "./BirdSpeciesForm.svelte";
  import BackButton from "$lib/components/BackButton.svelte";

  const { data } = $props();
  const { species, checklist } = data;
  const isNew = page.params.speciesID === 'new';

  let speciesRecord: Species = $state({
    speciesID: '',
    checklistID: checklist.checklistID!,
    commonName1: '',
    commonName2: '',
    taxonName1: '',
    taxonName2: '',
    scc: false,
    priority: false,
    priorityRank: '',
    globalStatus: '',
    regionalStatus: '',
    notes: '',
    smallBird: false,
    largeBird: false,
    raptor: false,
    waterbird: false
  });

  if (species) {
    speciesRecord = species
  }

  const handleSaveClick = async (ev: Event) => {
    ev.preventDefault();
    
    if (isNew) {
      speciesRecord.speciesID = makeID();
    }

    try {
      await speciesCollection.put($state.snapshot(speciesRecord));
      toast.push('Species saved')
    }
    catch(err) {
      if (err instanceof Error) {
        console.log(err)
        alert('Error saving record: ' + err.message);
      } else {
        alert('Error saving record: ' + JSON.stringify(err));
      }
    }

    if (isNew) {
      // update the checklist count
      checklist.speciesCount++
      try {
        await checklistCollection.put(checklist)
      }
      catch(err) {
        if (err instanceof Error) {
          console.log(err)
          alert('Error updating checklist count: ' + err.message);
        } else {
          alert('Error updating checklist count: ' + JSON.stringify(err));
        }
      }

      //reset the values
      speciesRecord.speciesID = '';
      speciesRecord.commonName1 = '';
      speciesRecord.commonName2 = '';
      speciesRecord.taxonName1 = '';
      speciesRecord.taxonName2 = '';
      speciesRecord.scc = false;
      speciesRecord.priority = false;
      speciesRecord.priorityRank = '';
      speciesRecord.globalStatus = '';
      speciesRecord.regionalStatus = '';
      speciesRecord.notes = '';
      speciesRecord.smallBird = false;
      speciesRecord.largeBird = false;
      speciesRecord.raptor = false;
      speciesRecord.waterbird = false;

      window.scrollTo(0, 0) // Scroll to the top of the page after saving
    }
    else {
      window.history.back(); // Go back to the previous page after saving
    }
  };


</script>

<div class="p-4">
  <BackButton />
  <BirdSpeciesForm bind:speciesRecord />
  <div class="flex justify-between">
    <button class="btn" onclick={() => window.history.back()}>Done</button>
    <button class="btn btn-primary" onclick={handleSaveClick}>Save and new</button>
  </div>
</div>
