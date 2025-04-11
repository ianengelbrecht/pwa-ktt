<script lang="ts">
  import Select from "svelte-select";
  import { SvelteSelectStyles } from "$lib/utils/SvelteSelectStyles";
  const { observationRecord = $bindable(), projectSites } = $props()
  
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

  const handleClickNow = (e: Event) => {
    e.preventDefault()
    const dateTimeNowString = new Date().toString();
    const dateTimeNowParts = dateTimeNowString.split(' ');
    const dateNow = dateTimeNowParts.slice(1, 4).join(' ');
    console.log(dateTimeNowString)
    console.log(dateNow)
    const timeNow = dateTimeNowParts[4].split(':').slice(0, 2).join(':');
    observationRecord.date = new Date(dateNow + ' UTC').toISOString().split('T')[0]; // we need this so that Date() doesn't make any adjustments for the local timezone
    observationRecord.time = timeNow;
  }

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
  <div class={["flex gap-2 w-full lg:w-1/2 p-1 items-center rounded", 
    {"ring-2 ring-orange-300": observationRecord.locationAccuracy > 20 && observationRecord.locationAccuracy < 50 },
    , {"ring-3 ring-red-600": observationRecord.locationAccuracy >= 50  }
    ]} >
    <label class="w-full">
      Location:
      <div class="w-full flex gap-2 items-center break-inside-avoid">
        <input type="text" name="location" class="w-64 md:w-1/2 input-base" bind:value={observationRecord.location} />
        <span class={["break-inside-avoid", 
        {"text-orange-300": observationRecord.locationAccuracy > 20 && observationRecord.locationAccuracy < 50 },
        {"text-red-600": observationRecord.locationAccuracy >= 50  }
        ]}> ± {observationRecord.locationAccuracy}m</span>
      </div>
    </label>
  </div>
  <div class="flex gap-2 items-end">
    <label class="flex flex-col w-48">
      Date:
      <input type="date" name="date" class="input-base" bind:value={observationRecord.date} />
    </label>
    <label class="flex flex-col w-28">
      Time:
      <input type="time" name="time" lang="en-GB" class="input-base" bind:value={observationRecord.time} />
    </label>
    <button class="w-16 btn" onclick={handleClickNow}>Now</button>
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
    <Select items={directions}
    --placeholder-color="oklch(96.8% 0.007 247.896)"
    --background="oklch(44.6% 0.043 257.281)" 
    --list-background="oklch(44.6% 0.043 257.281)"
    --list-border="4px solid white"
    --item-hover-bg="oklch(70.4% 0.04 256.788)"
    --item-hover-color="black"
    bind:value={observationRecord.startDirection} />
  </label>
  <label>
    Habitats utlized
    <Select 
    items={habitats} 
    multiple={true} 
    closeListOnChange={false}
    --placeholder-color="oklch(96.8% 0.007 247.896)"
    --background="oklch(44.6% 0.043 257.281)" 
    --list-background="oklch(44.6% 0.043 257.281)"
    --list-border="4px solid white"
    --item-hover-bg="oklch(70.4% 0.04 256.788)"
    --item-hover-color="black"
    --multi-item-bg="oklch(70.4% 0.04 256.788)"
    --multi-item-clear-icon-color="white"
    />
  </label>
  <label>
    Notes:
    <textarea name="notes" class="w-full md:w-1/2 input-base" bind:value={observationRecord.notes} rows="2"></textarea>
  </label>
</form>