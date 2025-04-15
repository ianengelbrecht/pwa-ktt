<script lang="ts">
  import { onMount } from 'svelte';
  import { convert } from 'geo-coordinates-parser';
  import type { CoordsContainerOptions } from '$lib/types/types';

  let placeHolderCoordinates = $state('Add coordinates');
  let coordinates: string | null = $state(null);
  let decimalCoordinates: string | null = $state(null);
  let accuracy: number | null = $state(null);
  let source: 'manual' | 'device' | null = null;
  let coordinatesError = $state('');
  let locationWatcher: number | null = $state(null);

  const {
    labelString,
    coordinatesString,
    maximumAllowedAccuracy = 50,
    handleSuccessfulCoordinates,
    handleMapButtonClick,
  }: CoordsContainerOptions = $props();

  $effect(() => {
    if (coordinatesString) {
      console.log('got new coordinates for input:', coordinatesString);
    }
  });

  if (coordinatesString) {
    coordinates = coordinatesString;
    try {
      const converted = convert(coordinatesString);
      decimalCoordinates = converted.decimalCoordinates;
    } catch (err) {
      if (err instanceof Error) {
        coordinatesError = err.message;
      } else {
        coordinatesError = 'Invalid coordinates';
      }
    }
  }

  onMount(() => {
    window.addEventListener('click', handleFirstContact);
    window.addEventListener('touchstart', handleFirstContact);
  });

  const cancelLocationWatcher = () => {
    if (locationWatcher) {
      navigator.geolocation.clearWatch(locationWatcher);
      locationWatcher = null;
    }
  };

  //apparently we can no longer use geolocation outside of a user gesture, so..
  const watchLocation = () => {
    if (navigator.geolocation && !coordinates) {
      console.log('watching location');
      locationWatcher = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          placeHolderCoordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          accuracy = Number(position.coords.accuracy.toFixed(0));
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        },
      );
    } else {
      placeHolderCoordinates = 'Add coordinates';
    }
  };

  const handleFirstContact = () => {
    watchLocation();
    window.removeEventListener('click', handleFirstContact);
    window.removeEventListener('touchstart', handleFirstContact);
  };

  const handleCoordinatesChange = (ev: Event) => {
    //we need setTimeout so defer the function until after the paste event is completed
    setTimeout(() => {
      if (coordinates) {
        cancelLocationWatcher();
        try {
          const converted = convert(coordinates);
          decimalCoordinates = converted.decimalCoordinates;
          accuracy = null;
          source = 'manual';
          coordinatesError = '';
          handleSuccessfulCoordinates({
            ...converted,
            ...{ accuracy, source },
          });
        } catch (error) {
          if (error instanceof Error) {
            coordinatesError = error.message;
          } else {
            coordinatesError = 'Invalid coordinates';
          }
        }
      }
    });
  };

  const handleCurrentCoordinatesClick = () => {
    if (placeHolderCoordinates != 'Add coordinates') {
      if (accuracy! < maximumAllowedAccuracy) {
        cancelLocationWatcher();
        coordinates = placeHolderCoordinates;
        decimalCoordinates = placeHolderCoordinates;
        source = 'device';
        coordinatesError = '';
        const converted = convert(coordinates); // this will always work, no need for try catch...
        handleSuccessfulCoordinates({ ...converted, ...{ accuracy, source } });
      } else {
        alert('Cannot record coordinates for accuracy greater than 50m');
      }
    }
  };

  const clearCoordinates = () => {
    coordinates = null;
    decimalCoordinates = null;
    placeHolderCoordinates = 'Add coordinates';
    accuracy = null;
    watchLocation();
  };
</script>

<div class="flex justify-between">
  <label for="coordinates-input" class="flex-1">
    {labelString ? labelString : 'Coordinates:'}
  </label>
  <span
    class={[
      'flex justify-end text-sm ',
      { 'text-slate-600': !decimalCoordinates },
      { 'text-slate-400': decimalCoordinates },
    ]}
  >
    {decimalCoordinates ? decimalCoordinates : 'dd.ddddd, dd.ddddd'}
  </span>
</div>
<!-- TODO handle this better -->
{#if coordinatesError}
  <span class="text-xs text-red-600">Invalid coordinates</span>
{/if}
<div
  class={[
    'flex gap-2 w-full items-center rounded',
    {
      'ring-2 ring-offset-2 ring-offset-black ring-orange-300':
        accuracy &&
        accuracy > maximumAllowedAccuracy / 2 &&
        accuracy < maximumAllowedAccuracy,
    },
    ,
    {
      'ring-3 ring-offset-2 ring-offset-black ring-red-600':
        (accuracy && accuracy >= maximumAllowedAccuracy) || coordinatesError,
    },
  ]}
>
  <div class="flex-1 relative">
    <input
      id="coordinates-input"
      type="text"
      class="w-full input-base"
      onpaste={handleCoordinatesChange}
      onblur={handleCoordinatesChange}
      bind:value={coordinates}
      placeholder={placeHolderCoordinates}
    />
    <div class="flex gap-2 absolute right-2 top-1/2 -translate-y-1/2">
      {#if coordinates}
        <button class=" h-10 w-10 cursor-pointer" onclick={clearCoordinates}>
          <span
            class="material-symbols-outlined text-slate-200 leading-none align-middle text-xl"
          >
            close
          </span>
        </button>
      {:else}
        <button
          class=" h-10 w-10 cursor-pointer"
          onclick={handleCurrentCoordinatesClick}
        >
          <span
            class={[
              'material-symbols-outlined leading-none align-middle text-xl',
              {
                'text-slate-200': placeHolderCoordinates != 'Add coordinates',
                'text-slate-400': placeHolderCoordinates == 'Add coordinates',
              },
            ]}
          >
            pin_drop
          </span>
        </button>
      {/if}
      <button class="h-10 w-10 cursor-pointer" onclick={handleMapButtonClick}>
        <span
          class="material-symbols-outlined text-slate-200 leading-none align-middle text-xl"
        >
          map
        </span>
      </button>
    </div>
  </div>
  {#if accuracy}
    <span
      class={[
        'min-w-fit',
        {
          'text-orange-300':
            accuracy &&
            accuracy > maximumAllowedAccuracy / 2 &&
            accuracy < maximumAllowedAccuracy,
        },
        { 'text-red-600': accuracy && accuracy >= maximumAllowedAccuracy },
      ]}
    >
      ± {accuracy}m&nbsp;
    </span>
  {/if}
</div>
