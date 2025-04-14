<script lang="ts">
  import { convert } from 'geo-coordinates-parser';

  let placeHolderCoordinates = $state('Add coordinates');
  let coordinates: string | null = $state(null);
  let decimalCoordinates: string | null = $state(null);
  let accuracy: number | null = $state(null);
  let coordinatesError = $state(false);

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        if (!coordinates) {
          const { latitude, longitude } = position.coords;
          placeHolderCoordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          accuracy = Number(position.coords.accuracy.toFixed(0));
        }
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

  const handleCoordinatesChange = (ev: Event) => {
    //we need setTimeout so defer the function until after the paste event is completed
    setTimeout(() => {
      if (coordinates) {
        try {
          const converted = convert(coordinates);
          decimalCoordinates = converted.decimalCoordinates;
          accuracy = null;
        } catch (error) {
          console.error('Error converting coordinates:', error);
          coordinatesError = true;
        }
      }
    });
  };

  const updateAccuracy = () => {
    accuracy = 50;
  };
</script>

<div class="relative w-full"></div>
{#if decimalCoordinates}
  <span class="text-xs text-gray-500">{decimalCoordinates}</span>
{/if}
{#if coordinatesError}
  <span class="text-xs text-red-600">Invalid coordinates</span>
{/if}
<div
  class={[
    'flex gap-2 w-full items-center rounded border',
    {
      'ring-2 ring-offset-2 ring-offset-black ring-orange-300':
        accuracy && accuracy > 20 && accuracy < 50,
    },
    ,
    {
      'ring-3 ring-offset-2 ring-offset-black ring-red-600':
        (accuracy && accuracy >= 50) || coordinatesError,
    },
  ]}
>
  <div class="flex-1 relative">
    <input
      type="text"
      class="w-full input-base"
      onpaste={handleCoordinatesChange}
      onblur={handleCoordinatesChange}
      bind:value={coordinates}
      placeholder={placeHolderCoordinates}
    />
  </div>
  {#if accuracy}
    <span
      class={[
        'min-w-fit',
        {
          'text-orange-300': accuracy && accuracy > 20 && accuracy < 50,
        },
        { 'text-red-600': accuracy && accuracy >= 50 },
      ]}
    >
      ± {accuracy}m&nbsp;
    </span>
  {/if}
</div>

<button class="btn mt-4" onclick={updateAccuracy}>Add 50m uncertainty</button>
