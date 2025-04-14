<script lang="ts">
  import { onMount } from "svelte";
  import type { ProjectSite } from "$lib/types/types";

  let { projectSite = $bindable() }: { projectSite: ProjectSite } = $props();

  const handleVerbatimLocationChanged = (ev: Event) => {
    ev.preventDefault();
    // TODO handle coordinate changes here, once we have a coordinates input
  };

  const hrs = Array.from({ length: 13 }, (_, i) => i);
  const minutes = Array.from({ length: 13 }, (_, i) => i * 5);

  let hoursSelect: HTMLSelectElement | null = null;
  let minutesSelect: HTMLSelectElement | null = null;

  onMount(() => {
    if (projectSite.sessionOrTransectDuration) {
      const hours = Math.floor(projectSite.sessionOrTransectDuration);
      const minutes = Math.round((projectSite.sessionOrTransectDuration - hours) * 60);
      if (hoursSelect) hoursSelect.value = hours.toString();
      if (minutesSelect) minutesSelect.value = minutes.toString();
    }
    else {
      if (hoursSelect) hoursSelect.value = "0";
      if (minutesSelect) minutesSelect.value = "0";
    }
  });

  // handle resets from the page
  $effect(() => {
    if (projectSite.sessionOrTransectDuration == null) {
      if (hoursSelect) hoursSelect.value = "0";
      if (minutesSelect) minutesSelect.value = "0";
    }
  });

  const handleHoursMinsChanged = () => {
    if (!hoursSelect || !minutesSelect) return;
    const hours = parseInt(hoursSelect.value || "0");
    const minutes = parseInt(minutesSelect.value || "0");
    projectSite.sessionOrTransectDuration = hours + minutes / 60;
  };


</script>

<form class="flex flex-col gap-4">
  <label>
    Site Code
    <input type="text" bind:value={projectSite.siteCode} placeholder="VP1, DT2, etc" class="w-full input-base" />
  </label>
  <label>
    Location
    <input bind:value={projectSite.verbatimLocation} placeholder="add coordinates" class="w-full input-base" onchange={handleVerbatimLocationChanged} />
  </label>
  <label>
    Threshold distance (km)
    <input type="number" bind:value={projectSite.thresholdDistance} class="w-full input-base" />
  </label>
  <div class="">
    <p>Planned Session/Transect Duration:</p>
    <div class="flex gap-4 ">
      <label>
        <select class="input-base" bind:this={hoursSelect} onchange={handleHoursMinsChanged}>
          {#each hrs as hr}
            <option value={hr}>{hr.toString().padStart(2, '0')}</option>
          {/each}
        </select>
        hr/s
      </label>
      <label>
        <select class="input-base" bind:this={minutesSelect} onchange={handleHoursMinsChanged}>
          {#each minutes as mins}
            <option value={mins}>{mins.toString().padStart(2, '0')}</option>
          {/each}
        </select>
        mins
      </label>
    </div>
  </div>
</form>