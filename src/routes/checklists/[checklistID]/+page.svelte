<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { error } from "@sveltejs/kit";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import ChecklistForm  from "./ChecklistForm.svelte";
  import  { makeID } from '$lib/utils';
  import type { Settings, Checklist } from "$lib/types/types";
  import { settingsCollection, checklistCollection } from "$lib/db/dexie";
  
  let { data } = $props();
  let { user, checklist: dbChecklist } = data;

  let checklist: Checklist = $state({
    checklistID: null, // auto generated on save
    checklistName: null,
    speciesCount: 0,
    createdDate: new Date().toISOString().split('T')[0],
    createdBy: user.userInitials, // from settings
    notes: null,
  });

  if (dbChecklist) {
    checklist = dbChecklist;
  }

  const validateChecklist = () => {
    if (!checklist.checklistName) {
      alert('Checklist name is required!');
      return false;
    }
    if (!checklist.createdBy) {
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

    if (!checklist.checklistID) {
      checklist.checklistID = makeID();
    }
    try {
      await checklistCollection.put( $state.snapshot(checklist));

      toast.push("Checklist saved")
      
      //no form reset, we go straight to the species page
      goto('/species?checklistID=' + checklist.checklistID); 
    }
    catch(err) {
      if (err instanceof Error) {
        console.log(err)
        alert('Error saving record: ' + err.message);
      } else {
        alert('Error saving record: ' + JSON.stringify(err));
      }
    }
  };

</script>

<main class="p-4 flex flex-col gap-2">
  <ChecklistForm bind:checklist />
  <div class="flex justify-between">
    <button class="btn" onclick={() => window.history.back()}>Done</button>
    <button class="btn btn-primary" onclick={handleSaveClick}>Save</button>
  </div>
</main>