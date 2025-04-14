<script lang="ts">
  import type { Checklist } from "$lib/types/types.d.ts";
  import BackButton from "$lib/components/BackButton.svelte";
  import SwipableList from "$lib/components/SwipableList.svelte";
  import CheckListCard from "./CheckListCard.svelte";
  import { checklistCollection, speciesCollection } from "$lib/db/dexie";
  
  const { data } = $props();
  const { checklists } = data;

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
<div class="p-4 flex flex-col gap-2">
  <BackButton />
  <h1 class="text-2xl">Checklists:</h1>
  <SwipableList 
    items={checklists} 
    deleteItem={handleDelete} 
    ItemComponent={CheckListCard} 
    deleteAll={handleDeleteAll}
    sortable={true} 
  />
</div>