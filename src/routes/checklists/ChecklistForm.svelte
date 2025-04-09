<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import  nanoid from '$lib/utils/nanoid';
  import type { Settings, Checklist } from "$lib/types/types";
  import { settingsCollection, checklistCollection } from "$lib/db/dexie";
  
  let settings: Settings;

  const checklist: Checklist = $state({
    checklistID: null, // auto generated on save
    checklistName: null,
    createdDate: new Date().toISOString().split('T')[0],
    createdBy: null, // from settings
    notes: null,
  })

  onMount(async () => {
    const settingsFromDB = await settingsCollection.toArray();
    settings = settingsFromDB[0]
    checklist.createdBy = settings.user?.userInitials || null
  });

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
      checklist.checklistID = nanoid();
    }
    console.log('Saving record:', checklist);
    try {
      const data = $state.snapshot(checklist);
      await checklistCollection.put(data);

      // Reset the form after saving
      checklist.checklistName = null;
      checklist.notes = null;
      checklist.createdDate= new Date().toISOString().split('T')[0];
      goto('/species?checklistID=' + checklist.checklistID); // Redirect to the species page with the checklist ID
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

<form class="p-4">
  <div class="flex flex-col gap-2">
    <label>
      Checklist Name:
      <input type="text" name="checklistName" class="w-full input-base" bind:value={checklist.checklistName} />
    </label>
    <label>
      Notes:
      <textarea name="notes" class="w-full input-base" bind:value={checklist.notes} rows="2"></textarea>
    </label>
    <div class="flex justify-between">
      <button class="w-24 p-4 border rounded border-white  cursor-pointer" onclick={() => window.history.back()}>Done</button>
      <button class="w-24 p-4 border rounded border-white bg-green-400 cursor-pointer" onclick={handleSaveClick}>Save</button>
    </div>
</form>

