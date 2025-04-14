<script lang="ts">
  import type { ObservationSummary } from '$lib/types/types.d.ts';

  let { item } = $props();
  const observation: ObservationSummary = item as ObservationSummary;
</script>

<a href={'/observations/' + observation.observationID}>
  <div class="w-full">
    <p class="text-lg font-bold">
      {observation.speciesName || 'species name not recorded!'}
    </p>
    <p>
      {observation.location}
      {observation.locationAccuracy == null
        ? '±?'
        : '± ' + observation.locationAccuracy + 'm'}
    </p>
    <p class="text-sm">
      Recorded at {observation.siteCode} on {observation.date}
      {observation.time}
    </p>
  </div>
</a>
