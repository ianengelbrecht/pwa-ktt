<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import  nanoid from '$lib/utils/nanoid';
  import type { Species }  from '$lib/types/types';
  import { speciesCollection } from "$lib/db/dexie";

  import BirdSpeciesForm from "../BirdSpeciesForm.svelte";

  const checklistID = page.url.searchParams.get('checklistID') || null;
  if (!checklistID) {
    //redirect to error page
    goto('/error', { replaceState: true });
  }

  const speciesRecord: Species = $state({
    speciesID: '',
    checklistID: checklistID!,
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

  const handleSaveClick = async (ev: Event) => {
    ev.preventDefault();
    
    speciesRecord.speciesID = nanoid();

    try {
      
      await speciesCollection.put($state.snapshot(speciesRecord));
      // Reset the form after saving
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

    catch(err) {
      if (err instanceof Error) {
        console.log(err)
        alert('Error saving record: ' + err.message);
      } else {
        alert('Error saving record: ' + JSON.stringify(err));
      }
    }
  };


</script>

<div class="p-4">
  <BirdSpeciesForm {speciesRecord} />
  <div class="flex justify-between">
    <button class="w-24 p-4 border rounded border-white  cursor-pointer" onclick={() => window.history.back()}>Done</button>
    <button class="p-4 border rounded border-white bg-green-400 cursor-pointer" onclick={handleSaveClick}>Save and new</button>
  </div>
</div>
