<script lang="ts">
  import { onMount } from "svelte";
  import type { Checklist } from "$lib/types/types.d.ts";
  import SwipableList from "$lib/components/SwipableList.svelte";
  import CheckListCard from "./CheckListCard.svelte";
  import { checklistCollection, speciesCollection } from "$lib/db/dexie";
  
  const checklists: Checklist[] = $state([])

  onMount(async () => {
    const checklistsFromDB = await checklistCollection.toArray();
    checklists.push(...checklistsFromDB);
  });

  const handleDelete = async (checklist: Record<string, any>) => {
    // first check if we have species in this checklist
    const speciesCount = await speciesCollection.where('checklistID').equals(checklist.checklistID).count();
    if (speciesCount > 0) {
      alert('Cannot delete checklist with species. Please delete species first.');
      return;
    }
    await checklistCollection.delete(checklist.checklistID);
    const index = checklists.findIndex((c) => c === checklist as Checklist);
    if (index !== -1) {
      checklists.splice(index, 1);
    }
  };

  const handleDeleteAll = async () => {
    alert('Cannot delete all checklists. Please delete individually, and proceed with caution!');
  };

</script>
<div class="p-4">
  <SwipableList 
    items={checklists} 
    deleteItem={handleDelete} 
    ItemComponent={CheckListCard} 
    itemIDfield={'checklistID'}
    deleteAll={handleDeleteAll}
    sortable={true} 
  />
</div>