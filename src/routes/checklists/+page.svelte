<script lang="ts">
  import { toast } from '@zerodevx/svelte-toast';
  import BackButton from '$lib/components/BackButton.svelte';
  import SwipableList from '$lib/components/SwipableList.svelte';
  import CheckListCard from './CheckListCard.svelte';
  import { checklistCollection } from '$lib/db/dexie';

  const { data } = $props();
  const { checklists } = data;

  const handleDelete = async (checklist: Record<string, any>) => {
    // first check if we have species in this checklist
    if (checklist.speciesCount > 0) {
      alert(
        'Cannot delete checklist with species. Please delete species first.',
      );
      return;
    }

    try {
      await checklistCollection.delete(checklist.checklistID);
    } catch (err) {
      if (err instanceof Error) {
        alert('Error deleting checklist: ' + err.message);
      } else {
        alert('Error deleting checklist: ' + JSON.stringify(err));
      }
      return;
    }

    const index = checklists.findIndex(
      (c) => c.checklistID === checklist.checklistID,
    );
    if (index !== -1) {
      checklists.splice(index, 1);
      toast.push(`Checklist deleted`, {
        theme: { '--toastBackground': 'oklch(26.6% 0.079 36.259)' },
      });
    }
  };
</script>

<div class="p-4 flex flex-col gap-2">
  <BackButton />
  <h1 class="text-2xl">Checklists:</h1>
  <SwipableList
    items={checklists}
    deleteItem={handleDelete}
    ItemComponent={CheckListCard}
    sortable={true}
  />
</div>
