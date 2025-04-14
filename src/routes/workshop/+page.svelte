<script lang="ts">
  import { convert } from 'geo-coordinates-parser';
  import { setContext } from 'svelte';
  import CoordinatesInput from '$lib/components/CoordinatesInput.svelte';

  const handleCoords = (coords: ReturnType<typeof convert>) => {
    console.log('Received coordinates:', coords.verbatimCoordinates);
  };

  setContext('coordsContainer', {
    inputLabelString: null,
    initialCoordinateString: null,
    maximumAllowedAccuracy: 50,
    handleSuccessfulCoordinates: handleCoords,
  });
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
</div>
