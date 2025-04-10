<script lang="ts">
  import type { Checklist } from '$lib/types/types';
  const { item } = $props();
  let checklist: Checklist = item as Checklist;

</script>

<a href={'/species?checklistID=' + checklist.checklistID}>
  <div class="w-full flex flex-col group-hover:bg-slate-600">
    <span class="text-xl">{checklist.checklistName}</span>
    <span class="text-sm">created: {checklist.createdDate} by {checklist.createdBy}</span> <!-- just the initials -->
  </div>
</a>

