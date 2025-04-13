<script lang="ts">
  const { item } = $props();
  let site = item
</script>

<div class="p-2 h-12 flex items-center">
  <h2 class="text-lg">{site.siteCode}</h2>
  {#if site.verbatimLocation}
    <p class="text-sm">Coordinates: {site.verbatimLocation}</p>
    <p class="text-sm">Threshold: {site.thresholdDistance}</p>
  {/if}
</div>