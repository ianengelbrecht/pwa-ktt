<script lang="ts">
  import { toast } from '@zerodevx/svelte-toast';
  import { goto } from '$app/navigation';
  import ChecklistForm from './ChecklistForm.svelte';
  import { makeID } from '$lib/utils';
  import type { Checklist } from '$lib/types/types';
  import { checklistCollection } from '$lib/db/dexie';

  let { data } = $props();
  let { user, checklist } = data;

  let checklistRecord: Checklist = $state({
    checklistID: null, // auto generated on save
    checklistName: null,
    speciesCount: 0,
    createdDate: new Date().toISOString().split('T')[0],
    createdBy: user.userInitials, // from settings
    notes: null,
  });

  if (checklist) {
    checklistRecord = checklist;
  }

  const validateChecklist = () => {
    if (!checklistRecord.checklistName) {
      alert('Checklist name is required!');
      return false;
    }
    if (!checklistRecord.createdBy) {
      alert('Created by is required!');
      return false;
    }
    return true;
  };

  const handleSaveClick = async (ev: Event) => {
    ev.preventDefault();

    if (!validateChecklist()) {
      return;
    }

    if (!checklistRecord.checklistID) {
      checklistRecord.checklistID = makeID();
    }
    try {
      await checklistCollection.put($state.snapshot(checklistRecord));

      toast.push('Checklist saved');

      //no form reset, we go straight to the species page
      goto('/species?checklistID=' + checklistRecord.checklistID);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        alert('Error saving record: ' + err.message);
      } else {
        alert('Error saving record: ' + JSON.stringify(err));
      }
    }
  };
</script>

<main class="p-4 flex flex-col gap-2">
  <ChecklistForm bind:checklist={checklistRecord} />
  <div class="flex justify-between">
    <button class="btn" onclick={() => window.history.back()}>Done</button>
    <button class="btn btn-primary" onclick={handleSaveClick}>Save</button>
  </div>
</main>
