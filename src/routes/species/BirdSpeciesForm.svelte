<script lang="ts">
  import  nanoid from '$lib/utils/nanoid';
  import type {Species} from '$lib/types/types';

  //TODO fetch the project checklist from settings

  const { saveRecord } = $props()

  const record: Species = $state({
    speciesID: '',
    checklistID: '',
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

    // Perform save operation here
    
    record.speciesID = nanoid();
    console.log('Saving record:', record);
    try {
      await saveRecord($state.snapshot(record));
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
<form id="species-form" class="flex flex-col  p-4" >

  <label>
    Common Name (Birdlife SA 2024):
    <input type="text" name="commonName1" class="w-full input-base" bind:value={record.commonName1}/>
  </label><br />

  <label>
    Afrikaans Name (Birdlife SA 2024):
    <input type="text" name="commonName2" class="w-full input-base" bind:value={record.commonName2} />
  </label><br />

  <label>
    Taxonomic Name (Birdlasser):
    <input type="text" name="taxonName1" class="w-full input-base" bind:value={record.taxonName1} />
  </label><br />

  <label>
    Taxonomic Name (Birdlife SA 2024):
    <input type="text" name="taxonName2" class="w-full input-base" bind:value={record.taxonName2} />
  </label><br />

  <label class="flex items-center space-x-2">
    <input type="checkbox" name="scc" class="w-6 h-6 input-base" bind:checked={record.scc} />
    <span>SCC</span>
  </label><br />
  
  <label class="flex items-center space-x-2">
    <input type="checkbox" name="priority" class="w-6 h-6 input-base" bind:checked={record.priority} />
    <span>WEF Priority</span>
  </label><br />

  <label>
    WEF Priority Species Rank:
    <input type="text" name="priorityRank" class="w-full input-base" bind:value={record.priorityRank} />
  </label><br />

  <label>
    Global Status (IUCN, 2024):
    <input type="text" name="globalStatus" class="w-full input-base" bind:value={record.globalStatus} />
  </label><br />

  <label>
    Regional Status (Taylor et al. 2015):
    <input type="text" name="regionalStatus" class="w-full input-base" bind:value={record.regionalStatus} />
  </label><br />

  <label>
    Notes:
    <textarea name="speciesNotes" class="w-full input-base" bind:value={record.notes}></textarea>
  </label><br />


  <label class="flex items-center space-x-2">
    <input type="checkbox" name="smallbird" class="w-6 h-6 input-base" bind:checked={record.smallBird} />
    <span>Small Bird (&lt;30cm)</span>
  </label><br />

  <label class="flex items-center space-x-2">
    <input type="checkbox" name="largebird" class="w-6 h-6 input-base" bind:checked={record.largeBird} />
    <span>Large Bird (&gt;30cm)</span>
  </label><br />

  <label class="flex items-center space-x-2">
    <input type="checkbox" name="raptor" class="w-6 h-6 input-base" bind:checked={record.raptor}/>
    <span>Raptor</span>
  </label><br />

  <label class="flex items-center space-x-2">
    <input type="checkbox" name="waterbird" class="w-6 h-6 input-base" bind:checked={record.waterbird} />
    <span>Waterbird (Associated)</span>
  </label><br />
  
  <div class="flex justify-between">
    <button class="w-24 p-4 border rounded border-white  cursor-pointer" onclick={() => window.history.back()}>Done</button>
    <button class="p-4 border rounded border-white bg-green-400 cursor-pointer" onclick={handleSaveClick}>Save and new</button>
  </div>
</form>


