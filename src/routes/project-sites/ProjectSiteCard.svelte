<script lang="ts">
  const { item } = $props();
  let site = item
</script>

<div class="h-48">
  <h2 class="text-lg">Site: {site.siteCode}</h2>
  {#if site.verbatimLocation}
  <p class="text-sm">Coordinates: {site.verbatimLocation}</p>
  <p class="text-sm">Threshold: {site.thresholdDistance}</p>
  {/if}
</div>