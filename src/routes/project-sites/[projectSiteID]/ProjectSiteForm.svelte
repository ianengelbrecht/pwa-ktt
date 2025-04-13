<script lang="ts">
  import type { ProjectSite } from "$lib/types/types";
  let { projectSite = $bindable() }: { projectSite: ProjectSite } = $props();

  const handleVerbatimLocationChanged = (ev: Event) => {
    ev.preventDefault();
    // TODO handle coordinate changes here, once we have a coordinates input
  };
</script>

<form class="flex flex-col gap-4">

  <label>
    Site Code ()
    <input type="text" bind:value={projectSite.siteCode} placeholder="VP1, DT2, etc" class="w-full input-base" />
  </label>
  <label>
    Location
    <input bind:value={projectSite.verbatimLocation} placeholder="Coordinates" class="w-full input-base" onchange={handleVerbatimLocationChanged} />
  </label>
  <label>
    Threshold distance
    <input type="number" bind:value={projectSite.thresholdDistance} class="w-full input-base" />
  </label>

</form>