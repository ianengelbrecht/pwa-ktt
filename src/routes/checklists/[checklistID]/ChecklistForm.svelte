<script lang="ts">
  import type { Checklist } from "$lib/types/types";
  
  let { checklist = $bindable() }: {checklist: Checklist} = $props()

</script>

<form class="flex flex-col gap-2">
  <label>
    Checklist Name:
    <input type="text" name="checklistName" class="w-full input-base" bind:value={checklist.checklistName} />
  </label>
  <label>
    Notes:
    <textarea name="notes" class="w-full input-base" bind:value={checklist.notes} rows="2"></textarea>
  </label>
</form>

