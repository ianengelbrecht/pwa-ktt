<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from '@zerodevx/svelte-toast'
  import type { CoordsRecord}  from '$lib/types/types'

  let coordsPresenter: HTMLParagraphElement | null
  let currentPosition: GeolocationPosition | null

  let data: CoordsRecord[] = []

  onMount(() => {
    console.log('mounting the form')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        currentPosition = position
        if (coordsPresenter) {
          coordsPresenter.innerHTML = `Latitude: ${position.coords.latitude.toFixed(5)}, 
            Longitude: ${position.coords.longitude.toFixed(5)}
            <br> Accuracy: ${position.coords.accuracy.toFixed(2)}m`
        }
      }, error => {
        if (coordsPresenter) {
          coordsPresenter.innerHTML = 'Error getting location'
        }
        console.error(error)  
      })
    } else {
      if (coordsPresenter) {
        coordsPresenter.innerHTML = 'Geolocation is not supported by this browser.'
      }
    }

    data = JSON.parse(localStorage.getItem('geoData') || '[]')
    console.log('there are', data.length, 'items recorded')
  })

  const saveCoords = () => {
    if (!currentPosition) return alert('No position available')

    const { latitude, longitude, accuracy } = currentPosition.coords
    data.push({
      timestamp: Date.now(),
      latitude,
      longitude,
      accuracy
    })
    localStorage.setItem('geoData', JSON.stringify(data))
    toast.push('Coordinates saved!')
  }

</script>

<main id="captureScreen" class="flex-1 p-4">
  <h1 class="text-xl mb-4">Current Coordinates</h1>
  <p id="coords" bind:this={coordsPresenter}>Waiting for location...</p>
  <button onclick={saveCoords} class="mt-4 p-2 bg-blue-600 rounded">Save Coordinates</button>
</main>