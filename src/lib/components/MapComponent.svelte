<script lang="ts">
  // BEWARE!!!! maplibgl uses LONG, LAT coordinates order, so always reverse latlongs
  import maplibregl from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import type { LngLatLike, Map, Marker } from 'maplibre-gl';
  import { onMount } from 'svelte';
  import type { CoordinatesString, MapComponentProps } from '$lib/types/types';

  let map: Map | null = null;
  let marker: Marker | null = null;
  let selectedStyle: string = $state('topo');
  let lastTapTime = 0;
  const doubleTapDelay = 300; // ms

  const {
    startingPoint,
    startingZoom = 6,
    handleNewMapCoordinates,
  }: MapComponentProps = $props();

  const wapadrandLngLat = [-25.77699, 28.33663].reverse() as LngLatLike;

  const startingLngLat = startingPoint
    ? (startingPoint
        .split(/[,\s]+/)
        .slice(0)
        .map(Number)
        .reverse() as LngLatLike)
    : wapadrandLngLat;

  const styles: Record<string, string> = {
    basic:
      'https://api.maptiler.com/maps/bright/style.json?key=mNheZee9ykXKwaWdZ5Hy',
    topo: 'https://api.maptiler.com/maps/topo/style.json?key=mNheZee9ykXKwaWdZ5Hy',
    satellite:
      'https://api.maptiler.com/maps/hybrid/style.json?key=mNheZee9ykXKwaWdZ5Hy',
  };

  onMount(() => {
    map = new maplibregl.Map({
      container: 'map', // container id
      style: styles.topo, // stylesheet location
      center: startingLngLat, // starting position [lng, lat]
      zoom: startingZoom, // starting zoom
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-left');
    map.doubleClickZoom.disable();

    marker = new maplibregl.Marker({ draggable: true, color: 'red' })
      .setLngLat(startingLngLat)
      .addTo(map);

    marker.on('dragend', () => {
      const lngLat = marker?.getLngLat();
      if (lngLat) {
        map?.easeTo({ center: lngLat, duration: 300 });
        const coords =
          `${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}` as CoordinatesString;
        handleNewMapCoordinates({
          coords,
          mapType: selectedStyle,
        });
      }
    });

    map.on('dblclick', (e) => {
      const { lngLat } = e;
      map?.easeTo({ center: lngLat, duration: 400 });
      marker?.setLngLat(lngLat);
      const coords =
        `${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}` as CoordinatesString;
      handleNewMapCoordinates({
        coords,
        mapType: selectedStyle,
      });
    });

    // double tap hander
    map.on('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapTime;

      if (tapLength < doubleTapDelay && tapLength > 0) {
        // Double tap detected
        const lngLat = e.lngLat;
        map!.easeTo({ center: lngLat, duration: 200 });
        marker?.setLngLat(lngLat);

        const coords =
          `${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}` as CoordinatesString;
        handleNewMapCoordinates({
          coords,
          mapType: selectedStyle,
        });
      }

      lastTapTime = currentTime;
    });

    map.on('styledata', () => {
      // Find the satellite layer(s) in the style
      const layers = map?.getStyle().layers;
      if (map && layers) {
        const satelliteLayer = layers.find(
          (layer) => layer.id === 'Satellite' || layer.id === 'satellite',
        );
        if (satelliteLayer) {
          map.setPaintProperty(satelliteLayer.id, 'raster-brightness-min', 0.4);
          map.setPaintProperty(satelliteLayer.id, 'raster-brightness-max', 1.0);
          map.setPaintProperty(satelliteLayer.id, 'raster-contrast', 0.4);
          map.setPaintProperty(satelliteLayer.id, 'raster-saturation', 0.2);
        }
      }
    });
  });

  const handleMapTypeChange = (event: Event) => {
    map?.setStyle(styles[selectedStyle]);
  };
</script>

<div id="map" class="relative w-full h-full">
  <select
    id="styleSwitcher"
    class="absolute top-0 right-0 m-2 p-2 bg-white text-black border rounded z-50"
    bind:value={selectedStyle}
    onchange={handleMapTypeChange}
  >
    {#each Object.keys(styles) as key}
      <option value={key}>{key}</option>
    {/each}
  </select>
</div>
