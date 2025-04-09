<script lang="ts">
  import type { Observation } from "$lib/types/types.d.ts";

  let { item } =  $props()
  const observationRecord: Observation = item as Observation;

</script>

<div>
  <p>{observationRecord.projectSurvey.season}</p>
  <p>{observationRecord.species.commonName1}</p>
  <p>{observationRecord.location} ±{observationRecord.locationAccuracy}m</p>
  <p>{observationRecord.projectSite.siteCode} {observationRecord.date} {observationRecord.time} {observationRecord.observerInitials}</p>
</div>