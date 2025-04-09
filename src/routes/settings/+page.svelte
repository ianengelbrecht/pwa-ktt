<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Select from "svelte-select";
  import nanoid from "$lib/utils/nanoid";
  import type { Settings, Project, ProjectSurvey, Checklist } from "$lib/types/types";
  import { settingsCollection, projectCollection, projectSurveyCollection, checklistCollection } from "$lib/db/dexie";

  // the select options
  const projects: Project[] = $state([]);
  const projectSurveys: ProjectSurvey[] = $state([]);
  const checklists: Checklist[] = $state([]);

  let settings: Settings = $state({
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
  });

  //we have to load things carefully to match everything in the database and the Selects
  onMount(async () => {
    // load the projects
    const projectsFromDB = await projectCollection.toArray();
    projects.push(...projectsFromDB);

    // load the checklists
    const checklistsFromDB = await checklistCollection.toArray();
    checklists.push(...checklistsFromDB);

    // load the settings
    const settingsFromDB = await settingsCollection.toArray();
    if (settingsFromDB.length > 0) {

      let dbSettings = settingsFromDB[0];
      if (dbSettings.user) {
        Object.assign(settings.user!, dbSettings.user)
      }
      if (dbSettings.project) {
        const dbProject = projectsFromDB.find((p) => p.projectID === dbSettings.project!.projectID);
        if (dbProject) { // it should always be true
          settings.project = dbProject;
        }

        // load the project surveys
        const projectSurveysFromDB = await projectSurveyCollection.where('projectID').equals(dbProject!.projectID).toArray();
        projectSurveys.push(...projectSurveysFromDB);

        if (dbSettings.projectSurvey) {
          const dbProjectSurvey = projectSurveysFromDB.find((ps) => ps.surveyID === dbSettings.projectSurvey!.surveyID);
          if (dbProjectSurvey) { // it should always be true
            settings.projectSurvey = dbProjectSurvey;
          }
        }
      }

      if (dbSettings.checklist) {
        const dbChecklist = checklistsFromDB.find((c) => c.checklistID === dbSettings.checklist!.checklistID);
        if (dbChecklist) { // it should always be true
          settings.checklist = dbChecklist;
        }
      }
    }

  });

  const saveSettings = () => {
    if (settings.user && !settings.user.userID) {
      settings.user.userID = nanoid();
    }
    if (!settings.settingsID) {
      settings.settingsID = nanoid();
    }
    console.log("Saving settings:", settings);
    settingsCollection.put(settings).then(() => {
      alert("Settings saved successfully!");
    }).catch((err) => {
      if (err instanceof Error) {
        console.log(err);
        alert("Error saving settings: " + err.message);
      }
    });
  }

  const handleAddProject = (ev: Event) => {
    ev.preventDefault();
    goto('/projects/new');
  }

  const handleAddSurvey = (ev: Event) => {
    ev.preventDefault();
    goto('/projects/new');
  }

  // not used currently, as checklists must be added via the checklists page
  // const handleAddChecklist = (ev: Event) => {
  //   ev.preventDefault();
  //   goto('/checklists/new');
  // }

</script>

<form class="flex flex-col gap-4 p-4 ">
  <h2 class="text-2xl">Settings</h2>
  <h4 class="text-lg">User details</h4>
  <div class="form-group">
    <label for="firstName">First Name:</label>
    <input type="text" id="firstName" class="input-base" bind:value={settings.user!.firstName} required />
  </div>
  <div class="form-group">
    <label for="lastName">Last Name:</label>
    <input type="text" id="lastName" class="input-base" bind:value={settings.user!.lastName} required />
  </div>
  <div class="form-group">
    <label for="userInitials">User Initials:</label>
    <input type="text" id="userInitials" class="input-base" bind:value={settings.user!.userInitials} required />
  </div>
  <p>Current Project:</p>
  <div class="flex gap-2">
    <Select
      bind:value={settings.project}
      items={projects}
      placeholder="Select a project"
    />
    <button class="w-36 p-2  rounded border border-white hover:ring ring-white cursor-pointer" onclick={handleAddProject}>Add project</button>
  </div>
  <p>Current Survey/Season:</p>
  <div class="flex gap-2">
    <Select
      bind:value={settings.project}
      items={projectSurveys}
      placeholder="Select a survey/season"
    />
    <button class="w-36 p-2  rounded border border-white hover:ring ring-white cursor-pointer" onclick={handleAddSurvey}>Add season</button>
  </div>
  <p>Checklist:</p>
  <div class="flex gap-2">
    <Select
      bind:value={settings.project}
      items={checklists}
      placeholder="Select a checklist"
    />
    <!-- Checklists must be added via checklists -->
    <!-- <button class="w-36 p-2  rounded border border-white hover:ring ring-white cursor-pointer" onclick={handleAddChecklist}>Add list</button> -->
  </div>
  <div class="flex justify-end">
    <button type="button" class="w-36 p-4 bg-green-400 rounded border border-white hover:ring ring-white cursor-pointer" onclick={saveSettings}>Save</button>
  </div>
</form>