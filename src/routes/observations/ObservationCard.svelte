<script lang="ts">
  import type { ObservationSummary } from "$lib/types/types.d.ts";

  let { item } =  $props()
  const observation: ObservationSummary = item as ObservationSummary;

</script>

<div>
  <p class="text-lg font-bold">{observation.speciesName || 'species name not recorded!'}</p>
  <p>{observation.location} ±{observation.locationAccuracy}m</p>
  <p>{observation.siteCode} {observation.date} {observation.time} {observation.observerInitials}</p>
</div>