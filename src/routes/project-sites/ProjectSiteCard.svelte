<script lang="ts">
  import { decimalToTime } from '$lib/utils';
  import type { ProjectSite } from '$lib/types/types';
  const { item } = $props();
  let site = item as ProjectSite;

  const isIncidental =
    site.siteCode?.toLowerCase().replace(/\s+/g, '') == 'incidental' || false;

  const handleHrefClick = (ev: Event) => {
    if (isIncidental) {
      ev.preventDefault();
    }
  };
</script>

<a href={'/project-sites/' + site.projectSiteID} onclick={handleHrefClick}>
  <div class="p-2 flex flex-col">
    <h2 class="text-lg">{site.siteCode}</h2>
    <div>
      {#if site.verbatimLocation}
        <p class="text-sm">Coordinates: {site.verbatimLocation}</p>
        <p class="text-sm">Threshold: {site.thresholdDistance}</p>
      {/if}
      {#if !isIncidental}
        <p class="text-sm">
          Average Duration: {site.sessionOrTransectDuration
            ? decimalToTime(site.sessionOrTransectDuration)
            : '0:00'}
        </p>
      {/if}
    </div>
  </div>
</a>
