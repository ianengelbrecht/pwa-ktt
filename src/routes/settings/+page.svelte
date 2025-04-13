<script lang="ts">
  import type { PageProps } from './$types';
  import { goto } from "$app/navigation";
  import { makeID } from '$lib/utils';
  import SettingsForm from "./SettingsForm.svelte";
  import { settingsCollection, projectSurveyCollection } from "$lib/db/dexie";

  let { data  }: PageProps = $props();
  let { settings, projects, projectSurveys, checklists } = data; // destructure the data object

  let settingsViewModel = $state(settings)

  const handleProjectChange = async () => {
    if (settingsViewModel.project) {
      projectSurveyCollection.where('projectID').equals(settingsViewModel.project!.projectID!).toArray().then((surveys) => {
        projectSurveys.length = 0; // clear the array
        if (surveys.length) {
          projectSurveys.push(...surveys); // add the new surveys
        }
      });
    }
  }

  const validateSettings = () => {
    if (!settingsViewModel.user?.firstName || !settingsViewModel.user?.lastName || !settingsViewModel.user?.userInitials) {
      alert('Please enter your details!')
      return false;
    }
    return true;
  }

  const saveSettings = async () => {
    if (!validateSettings()) {
      return false;
    }

    if (settingsViewModel.user && !settingsViewModel.user.userID) {
      settingsViewModel.user.userID = makeID();
    }
    if (!settingsViewModel.settingsID) {
      settingsViewModel.settingsID = makeID();
    }
    await settingsCollection.put($state.snapshot(settingsViewModel))

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
        goto('/project-surveys/' + settingsViewModel.project?.projectID);
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
      if (settingsViewModel.checklist) {
        goto('/observations' + '?projectID=' + settingsViewModel.project?.projectID);
      } else {
        goto('/checklists/new');
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
  
</script>

<main class="p-2 flex flex-col gap-4">
  <h2 class="text-xl">Settings</h2>
  <SettingsForm 
  bind:settings={settingsViewModel}
  {projects} 
  {projectSurveys} 
  {checklists}  
  {handleProjectChange}
  {handleAddProject}
  {handleAddSurvey} />
  <div class="flex justify-between gap-4">
    <button class="btn" onclick={() => console.log($state.snapshot(settingsViewModel))}>Log settings</button>
    <button type="button" class="btn btn-primary" onclick={handleSaveSettings}>Save settings</button>
  </div>
</main>