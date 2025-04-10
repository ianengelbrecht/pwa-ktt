<script lang="ts">
  import Select from "svelte-select";
  const { observationRecord, projectSites } = $props()
  
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const habitats = [
    'Agricultural field', 
    'Drainage line', 
    'Forest/plantation',
    'Man-made structure',
    'No habitat used',
    'Open grassland',
    'Ridgeline',
    'Rocky hillside',
    'Valley',
    'Water body',
    'Wetland',
    'Woodland',
    'Other'
  ]

</script>

<form id="observation-form" class="flex flex-col gap-2" >
  <label>
    Observer:
    <input type="text" name="observer" class="w-full md:w-1/2 input-base" bind:value={observationRecord.observerInitials} />
  </label>
  <label>
    Site:
    <select class="w-full md:w-1/2 input-base" bind:value={observationRecord.projectSite}>
      <option value="" selected>Select an option</option>
      {#each projectSites as site}
        <option value={site}>{site.siteCode}</option>
      {/each}
    </select>
  </label>
  <!-- TODO Species field -->
  <div class={["flex gap-2 w-full lg:w-1/2 p-1 items-center rounded", {"ring-2 ring-orange-300": observationRecord.locationAccuracy > 20}]} >
    <label class="w-full">
      Location:
      <div class="w-full flex gap-2 items-center break-inside-avoid">
        <input type="text" name="location" class="w-64 md:w-1/2 input-base" bind:value={observationRecord.location} />
        <span class={["break-inside-avoid", {"text-orange-300": observationRecord.locationAccuracy > 20}]}>± {observationRecord.locationAccuracy}m</span>
      </div>
    </label>
  </div>
  <div class="flex gap-2">
    <label>
      Date:
      <input type="date" name="date" class="w-full md:w-1/2 input-base" bind:value={observationRecord.date}/>
    </label>
    <label>
      Time:
      <input type="time" name="time" lang="en-GB" class="w-full md:w-1/2 input-base" bind:value={observationRecord.time} />
    </label>
  </div>
  <label>
    No. individuals:
    <input type="number" class="w-full md:w-1/2 input-base" bind:value={observationRecord.count} />
  </label>
  <label>
    Dist. at start (m):
    <input type="number" class="w-full md:w-1/2 input-base" min="0" bind:value={observationRecord.startDistance} />
  </label>
  <label>
    Dir. at start:
    <Select items={directions} />
  </label>
  <p>Habitats utlized</p>
  <Select items={habitats} multiple={true} />
  <label>
    Notes:
    <textarea name="notes" class="w-full md:w-1/2 input-base" bind:value={observationRecord.notes} rows="2"></textarea>
  </label>
</form>