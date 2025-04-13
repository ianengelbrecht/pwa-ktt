<script lang="ts">

  import type { Species }  from '$lib/types/types';
  const { speciesRecord =$bindable() }: {speciesRecord: Species} = $props()

</script>
<form id="species-form" class="flex flex-col" >

  <label>
    Common Name (Birdlife SA 2024):
    <input type="text" name="commonName1" class="w-full input-base" bind:value={speciesRecord.commonName1}/>
  </label><br />

  <label>
    Afrikaans Name (Birdlife SA 2024):
    <input type="text" name="commonName2" class="w-full input-base" bind:value={speciesRecord.commonName2} />
  </label><br />

  <label>
    Taxonomic Name (Birdlasser):
    <input type="text" name="taxonName1" class="w-full input-base" bind:value={speciesRecord.taxonName1} />
  </label><br />

  <label>
    Taxonomic Name (Birdlife SA 2024):
    <input type="text" name="taxonName2" class="w-full input-base" bind:value={speciesRecord.taxonName2} />
  </label><br />

  <label class="flex items-center space-x-2">
    <input type="checkbox" name="scc" class="w-6 h-6 input-base" bind:checked={speciesRecord.scc} />
    <span>SCC</span>
  </label><br />
  
  <label class="flex items-center space-x-2">
    <input type="checkbox" name="priority" class="w-6 h-6 input-base" bind:checked={speciesRecord.priority} />
    <span>WEF Priority</span>
  </label><br />

  <label>
    WEF Priority Species Rank:
    <input type="text" name="priorityRank" class="w-full input-base" bind:value={speciesRecord.priorityRank} />
  </label><br />

  <label>
    Global Status (IUCN, 2024):
    <input type="text" name="globalStatus" class="w-full input-base" bind:value={speciesRecord.globalStatus} />
  </label><br />

  <label>
    Regional Status (Taylor et al. 2015):
    <input type="text" name="regionalStatus" class="w-full input-base" bind:value={speciesRecord.regionalStatus} />
  </label><br />

  <label>
    Notes:
    <textarea name="speciesNotes" class="w-full input-base" bind:value={speciesRecord.notes}></textarea>
  </label><br />

  <label class="flex items-center space-x-2">
    <input type="checkbox" name="smallbird" class="w-6 h-6 input-base" bind:checked={speciesRecord.smallBird} />
    <span>Small Bird (&lt;30cm)</span>
  </label><br />

  <label class="flex items-center space-x-2">
    <input type="checkbox" name="largebird" class="w-6 h-6 input-base" bind:checked={speciesRecord.largeBird} />
    <span>Large Bird (&gt;30cm)</span>
  </label><br />

  <label class="flex items-center space-x-2">
    <input type="checkbox" name="raptor" class="w-6 h-6 input-base" bind:checked={speciesRecord.raptor}/>
    <span>Raptor</span>
  </label><br />

  <label class="flex items-center space-x-2">
    <input type="checkbox" name="waterbird" class="w-6 h-6 input-base" bind:checked={speciesRecord.waterbird} />
    <span>Waterbird (Associated)</span>
  </label><br />
  

</form>


