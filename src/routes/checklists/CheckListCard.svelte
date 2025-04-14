<script lang="ts">
  import type { Checklist } from '$lib/types/types';
  const { item } = $props();
  let checklist: Checklist = item as Checklist;
</script>

<a href={'/species?checklistID=' + checklist.checklistID}>
  <div class="w-full flex flex-col group-hover:bg-slate-600">
    <p class="text-xl">{checklist.checklistName}</p>
    <p class="text-sm">Species count: {checklist.speciesCount}</p>
    <p class="text-sm">
      Created on {checklist.createdDate} by {checklist.createdBy}
    </p>
    <!-- just the initials -->
  </div>
</a>
