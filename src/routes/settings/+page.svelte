<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { goto } from "$app/navigation";
  import { makeID } from '$lib/utils';
  import BackButton from "$lib/components/BackButton.svelte";
  import SettingsForm from "./SettingsForm.svelte";
  import type { Settings } from "$lib/types/types";
  import { settingsCollection, projectSurveyCollection } from "$lib/db/dexie";

  let { data } = $props();
  let { settings, projects, projectSurveys, checklists } = data; // destructure the data object

  let settingsRecord: Settings = $state({
    settingsID: null,
    user: {
      userID: null,
      firstName: null,
      lastName: null,
      userInitials: null,
    },
    project: null,
    projectSurvey: null,
    checklist: null
  })

  if (settings) {
    settingsRecord = settings
  }

  const handleProjectChange = async () => {
    if (settingsRecord.project) {
      projectSurveyCollection.where('projectID').equals(settingsRecord.project!.projectID!).toArray().then((surveys) => {
        projectSurveys.length = 0; // clear the array
        if (surveys.length) {
          projectSurveys.push(...surveys); // add the new surveys
        }
      });
    }
  }

  const validateSettings = () => {
    if (!settingsRecord.user?.firstName || !settingsRecord.user?.lastName || !settingsRecord.user?.userInitials) {
      alert('Please enter your details!')
      return false;
    }
    return true;
  }

  const saveSettings = async () => {
    if (!validateSettings()) {
      return false;
    }

    if (settingsRecord.user && !settingsRecord.user.userID) {
      settingsRecord.user.userID = makeID();
    }
    if (!settingsRecord.settingsID) {
      settingsRecord.settingsID = makeID();
    }
    await settingsCollection.put($state.snapshot(settingsRecord))

    return true
  }

  const handleAddProject = async () => {
    try {
      const success = await saveSettings()
      if (success) {
        goto('/projects/new');
      }
    }
    catch(err) {
      if (err instanceof Error) {
        alert('Error saving settings:' + err.message);
      } else {
        alert('Error saving settings:' + err);
      }
    }
    
  }

  const handleAddSurvey = async () => {

    try {
      const success = await saveSettings()
      if (success) {
        goto('/project-surveys/' + settingsRecord.project?.projectID);
      }
    }
    catch(err) {
      if (err instanceof Error) {
        alert('Error saving settings:' + err.message);
      } else {
        alert('Error saving settings:' + err);
      }
    }
  }

  // not used currently, as checklists must be added via the checklists page
  // const handleAddChecklist = (ev: Event) => {
  //   ev.preventDefault();
  //   goto('/checklists/new');
  // }

  const handleSaveSettings = async () => {

    try {
      await saveSettings()
      toast.push('Settings saved');
    }
    catch(err) {
      if (err instanceof Error) {
        alert('Error saving settings:' + err.message);
      } else {
        alert('Error saving settings:' + err);
      }
    }
  }
  
</script>

<main class="p-4 flex flex-col gap-4">
  <BackButton />
  <h2 class="text-2xl">Settings</h2>
  <SettingsForm 
  bind:settingsRecord
  {projects} 
  {projectSurveys} 
  {checklists}  
  {handleProjectChange}
  {handleAddProject}
  {handleAddSurvey} />
  <div class="flex justify-end gap-4">
    <button type="button" class="btn btn-primary" onclick={handleSaveSettings}>Save settings</button>
  </div>
</main>