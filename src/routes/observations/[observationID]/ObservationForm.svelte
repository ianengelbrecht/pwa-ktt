<script lang="ts">
  import Select from 'svelte-select';
  import { dateTimeNow } from '$lib/utils';
  import type {
    Species,
    ConvertedCoordinatesWithAccuracy,
  } from '$lib/types/types';
  import { directions, habitats } from './picklists';
  import CoordinatesInput from '$lib/components/CoordinatesInput.svelte';

  const {
    observationRecord = $bindable(),
    projectSites,
    species,
    handleMapButtonClick,
  } = $props();

  // for filtering in the species Select
  const filterSpecies = async (filterText: string) => {
    if (filterText && filterText.trim()) {
      const searchString =
        filterText
          .trim()
          .split(/\s+/)
          .map((part) => `\\b${part}`) // Enforce word boundary *before* each part
          .join('.*') + '.*';
      const regex = new RegExp(searchString, 'i');
      const matchingSpecies = species.filter((species: Species) => {
        return (
          regex.test(species.commonName1) ||
          regex.test(species.commonName2) ||
          regex.test(species.taxonName1) ||
          regex.test(species.taxonName2)
        );
      });
      return matchingSpecies;
    } else {
      return [];
    }
  };

  const handleClickNow = (e: Event) => {
    e.preventDefault();
    const { dateNow, timeNow } = dateTimeNow();
    observationRecord.date = dateNow;
    observationRecord.time = timeNow;
    console.log('date and time updated');
  };

  const handleSiteCodeChange = (e: Event) => {
    console.log('selected site is', observationRecord.projectSite);
  };

  const handleSuccessfulCoordinates = (
    coords: ConvertedCoordinatesWithAccuracy,
  ) => {
    observationRecord.verbatimCoordinates = coords.verbatimCoordinates;
    observationRecord.decimalLatitude = coords.decimalLatitude;
    observationRecord.decimalLongitude = coords.decimalLongitude;
    observationRecord.coordinatesAccuracy = coords.accuracy;
    // if the user entered the coordinates manually they need to select the source themselves
    if (coords.source === 'device') {
      observationRecord.coordinatesSource = 'device GPS';
    } else {
      observationRecord.coordinatesSource == null;
    }
  };
</script>

<form id="observation-form" class="w-full flex flex-col gap-2">
  <label for="observer" class="">
    <span>Observer:</span>
    <input
      id="observer"
      type="text"
      name="observer"
      class="w-full input-base"
      bind:value={observationRecord.observerInitials}
    />
  </label>
  <label class="flex flex-col">
    <span>Site:</span>
    <select
      class="w-full input-base"
      bind:value={observationRecord.projectSite}
      onchange={handleSiteCodeChange}
    >
      {#if projectSites.length === 0}
        <option value="" disabled>No sites available</option>
      {/if}
      <option value="" selected>Select an option</option>
      {#each projectSites as site}
        <option value={site.siteCode}>{site.siteCode}</option>
      {/each}
    </select>
  </label>
  <label class="">
    Species:
    <Select
      loadOptions={filterSpecies}
      debounceWait={500}
      itemId="speciesID"
      label="commonName1"
      placeholder="Search for species..."
      --placeholder-color="oklch(70.4% 0.04 256.788)"
      --background="oklch(44.6% 0.043 257.281)"
      --list-background="oklch(44.6% 0.043 257.281)"
      --list-border="4px solid white"
      --item-hover-bg="oklch(70.4% 0.04 256.788)"
      --item-hover-color="black"
      bind:value={observationRecord.species}
    />
  </label>
  <CoordinatesInput
    labelString="Observation coordinates"
    coordinatesString={observationRecord.location}
    {handleSuccessfulCoordinates}
    {handleMapButtonClick}
  />
  <div class="w-full flex gap-2 items-end">
    <label class="grow flex flex-col">
      Date:
      <input
        type="date"
        name="date"
        class="input-base"
        bind:value={observationRecord.date}
      />
    </label>
    <label class="grow flex flex-col">
      Time:
      <input
        type="time"
        name="time"
        class="input-base"
        step="1"
        bind:value={observationRecord.time}
      />
    </label>
  </div>
  <button class="btn" onclick={handleClickNow}> Now </button>
  <label class="flex flex-col">
    <span>No. individuals:</span>
    <input
      type="number"
      class="w-full input-base"
      bind:value={observationRecord.count}
    />
  </label>
  <label class="flex flex-col">
    <span>Dist. at start (m):</span>
    <input
      type="number"
      class="w-full input-base"
      min="0"
      bind:value={observationRecord.startDistance}
    />
  </label>
  <label class="">
    Dir. at start:
    <Select
      items={directions}
      --placeholder-color="oklch(70.4% 0.04 256.788)"
      --background="oklch(44.6% 0.043 257.281)"
      --list-background="oklch(44.6% 0.043 257.281)"
      --list-border="4px solid white"
      --item-hover-bg="oklch(70.4% 0.04 256.788)"
      --item-hover-color="black"
      bind:value={observationRecord.startDirection}
    />
  </label>
  <label class="">
    Habitats utilized
    <Select
      items={habitats}
      multiple={true}
      closeListOnChange={false}
      --placeholder-color="oklch(70.4% 0.04 256.788)"
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
  <label class="w-full flex flex-col">
    <span>Notes:</span>
    <textarea
      name="notes"
      class="w-full input-base"
      bind:value={observationRecord.notes}
      rows="2"
    ></textarea>
  </label>
</form>
