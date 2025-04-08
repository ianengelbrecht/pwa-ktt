<script lang="ts">
  import type { Checklist } from '$lib/types/types';
  const { item }: {item: Checklist} = $props();

</script>

<a href={'/species/' + item.checklistID}>
  <div class="w-full flex flex-col group-hover:bg-slate-600">
    <span class="text-xl">{item.checklistName}</span>
    <span class="text-sm">created: {item.createdDate} {item.createdBy}</span> <!-- just the initials -->
  </div>
</a>

