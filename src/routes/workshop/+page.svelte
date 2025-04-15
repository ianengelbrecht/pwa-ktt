<script lang="ts">
  import { convert } from 'geo-coordinates-parser';
  import { setContext } from 'svelte';
  import CoordinatesInput from '$lib/components/CoordinatesInput.svelte';
  import type {
    CoordinatesString,
    CoordsContainerOptions,
  } from '$lib/types/types';
  import MapComponent from '$lib/components/MapComponent.svelte';

  const coordinatesArray: CoordinatesString[] = $state([]);

  const handleCoords = (coords: ReturnType<typeof convert>) => {
    console.log('Received coordinates:', coords.verbatimCoordinates);
  };

  const coordsInputStuff: CoordsContainerOptions = $state({
    inputLabelString: null,
    inputCoordinatesString: null,
    maximumAllowedAccuracy: 50,
    handleSuccessfulCoordinates: handleCoords,
    handleMapClick: (ev: Event) => {
      console.log('Map clicked');
    },
  });
  setContext('coordsContainer', coordsInputStuff);

  const handleNewMapCoordinates = (coords: CoordinatesString) => {
    console.log('Received coordinates from map:', coords);
    coordinatesArray.push(coords);
    coordsInputStuff.inputCoordinatesString = coords;
  };
</script>

<div class="p-4 flex flex-col gap-4">
  <p>These are our icons</p>
  <div class="flex gap-4">
    <span class="material-symbols-outlined"> pin_drop </span>
    <span class="material-symbols-outlined"> map </span>
    <span class="material-symbols-outlined"> search </span>
    <span class="material-symbols-outlined"> sort </span>
    <span class="material-symbols-outlined"> close </span>
  </div>
  <div class="md:w-1/2 lg:w-1/3">
    <p>This is a coordinates input</p>
    <CoordinatesInput />
  </div>
  <div>
    {#each coordinatesArray as coords}
      <div class="p-2 border border-gray-300 rounded mb-2">
        <p>Coordinates: {coords}</p>
      </div>
    {/each}
  </div>
  <button class="btn" onclick={() => (coordinatesArray.length = 0)}
    >Clear coordinates</button
  >
  <div class="w-full" style="height: 600px;">
    <MapComponent startingZoom={12} {handleNewMapCoordinates} />
  </div>
</div>
