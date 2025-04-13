<script lang="ts">
  import Select from "svelte-select";
  import { dateTimeNow } from "$lib/utils";
  import type {Species} from "$lib/types/types";
  const { observationRecord = $bindable(), projectSites, species } = $props()
  import { directions, habitats } from "./picklists"

  // for filtering in the species Select
  const filterSpecies = async (filterText: string) => {
    if (filterText && filterText.trim()) {
      const searchString = filterText
      .trim()
      .split(/\s+/)
      .map(part => `\\b${part}`)  // Enforce word boundary *before* each part
      .join('.*') + '.*';  
      const regex = new RegExp(searchString, 'i')
      const matchingSpecies = species.filter((species: Species) => {
        return regex.test(species.commonName1) ||  regex.test(species.commonName2) || regex.test(species.taxonName1) || regex.test(species.taxonName2)
      })
      return matchingSpecies
    }
    else {
      return []
    }
  }

  const handleClickNow = (e: Event) => {
    e.preventDefault()
    const { dateNow, timeNow } = dateTimeNow()
    observationRecord.date = dateNow
    observationRecord.time = timeNow;
    console.log('date and time updated')
  }

  const handleSiteCodeChange = (e: Event) => {
    console.log('selected site is', observationRecord.projectSite)
  }

</script>

<form id="observation-form" class="flex flex-col gap-2" >
  <label>
    Observer:
    <input type="text" name="observer" class="w-full md:w-1/2 input-base" bind:value={observationRecord.observerInitials} />
  </label>
  <label>
    Site:
    <select class="w-full md:w-1/2 input-base" bind:value={observationRecord.projectSite} onchange={handleSiteCodeChange}>
      {#if projectSites.length === 0}
        <option value="" disabled>No sites available</option>
      {/if}
      <option value="" selected>Select an option</option>
      {#each projectSites as site}
        <option value={site.siteCode}>{site.siteCode}</option>
      {/each}
    </select>
  </label>
  <label>
    Species:
    <Select loadOptions={filterSpecies}
    debounceWait={500}
    itemId="speciesID"
    label="commonName1"
    placeholder="Search for species..."
    --placeholder-color="oklch(96.8% 0.007 247.896)"
    --background="oklch(44.6% 0.043 257.281)" 
    --list-background="oklch(44.6% 0.043 257.281)"
    --list-border="4px solid white"
    --item-hover-bg="oklch(70.4% 0.04 256.788)"
    --item-hover-color="black"
    bind:value={observationRecord.species} />
  </label>
  <div class={["flex gap-2 w-full lg:w-1/2 items-center rounded", 
    {"ring-2 ring-offset-2 ring-offset-black ring-orange-300": observationRecord.locationAccuracy > 20 && observationRecord.locationAccuracy < 50 },
    , {"ring-3 ring-offset-2 ring-offset-black ring-red-600": observationRecord.locationAccuracy >= 50  }
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
    <button class="btn" style="width: fit-content;" onclick={handleClickNow}>Now</button>
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
    Habitats utilized
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
    bind:value={observationRecord.habitats}
    />
  </label>
  <label>
    Notes:
    <textarea name="notes" class="w-full md:w-1/2 input-base" bind:value={observationRecord.notes} rows="2"></textarea>
  </label>
</form>