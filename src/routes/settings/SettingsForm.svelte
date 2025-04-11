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
    //TODO only load checklists which have species
    const checklistsFromDB = await checklistCollection.toArray();
    checklists.push(...checklistsFromDB);

    // load the settings
    const settingsFromDB = await settingsCollection.toArray();
    if (settingsFromDB.length > 0) {

      let dbSettings = settingsFromDB[0];
      settings.settingsID = dbSettings.settingsID;
      if (dbSettings.user) {
        Object.assign(settings.user!, dbSettings.user)
      }
      if (dbSettings.project) {
        const dbProject = projectsFromDB.find((p) => p.projectID === dbSettings.project!.projectID);
        if (dbProject) { // it should always be true
          settings.project = dbProject;
          
          // load the project surveys
          const projectSurveysFromDB = await projectSurveyCollection.where('projectID').equals(dbProject.projectID!).toArray();
          projectSurveys.push(...projectSurveysFromDB);

          if (dbSettings.projectSurvey) {
            const dbProjectSurvey = projectSurveysFromDB.find((ps) => ps.surveyID === dbSettings.projectSurvey!.surveyID);
            if (dbProjectSurvey) { // it should always be true
              settings.projectSurvey = dbProjectSurvey;
            }
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

  const handleProjectChange = () => {
    console.log('getting project surveys...')
    if (settings.project) {
      projectSurveyCollection.where('projectID').equals(settings.project!.projectID!).toArray().then((surveys) => {
        projectSurveys.length = 0; // clear the array
        if (surveys.length) {
          projectSurveys.push(...surveys); // add the new surveys
        }
      });
    }
  }

  const validateSettings = () => {

  }

  const saveSettings = () => {
    if (settings.user && !settings.user.userID) {
      settings.user.userID = nanoid();
    }
    if (!settings.settingsID) {
      settings.settingsID = nanoid();
    }
    settingsCollection.put($state.snapshot(settings)).then((result) => {
      window.history.back()
    }).catch((err) => {
      if (err instanceof Error) {
        console.log(err);
        alert("Error saving settings: " + err.message);
      }
    });
  }

  const handleAddProject = async (ev: Event) => {
    ev.preventDefault();

    goto('/projects/new');
  }

  const handleAddSurvey = async (ev: Event) => {
    ev.preventDefault();
    goto('/project-surveys/new' + '?projectID=' + settings.project?.projectID);
  }

  // not used currently, as checklists must be added via the checklists page
  // const handleAddChecklist = (ev: Event) => {
  //   ev.preventDefault();
  //   goto('/checklists/new');
  // }

</script>

<form class="flex flex-col gap-4 p-4">
  <h2 class="text-2xl">Settings</h2>
  <h4 class="text-lg">User details</h4>
  <fieldset class="aligned-fields">

    <label for="firstName">
      First Name:
      <input type="text" id="firstName" class="md:w-1/2 input-base" bind:value={settings.user!.firstName} required />
    </label>
    <label for="lastName">
      Last Name:
      <input type="text" id="lastName" class="md:w-1/2 input-base" bind:value={settings.user!.lastName} required />
    </label>
    <label for="userInitials">
      User Initials:
      <input type="text" id="userInitials" class="md:w-1/2 input-base" bind:value={settings.user!.userInitials} required />
    </label>

  </fieldset>
  <hr/>
  <div>
    <p>Current Project:</p>
    <div class="flex gap-2">
      <!-- Seems many of the css variables don't work -->
      <Select
        bind:value={settings.project}
        items={projects}
        placeholder="Select a project"
        itemId={'projectID'}
        label={'projectName'}
        --placeholder-color="oklch(96.8% 0.007 247.896)"
        --background="oklch(44.6% 0.043 257.281)" 
        --list-background="oklch(44.6% 0.043 257.281)"
        --list-border="4px solid white"
        --item-hover-bg="oklch(70.4% 0.04 256.788)"
        --item-hover-color="black"
        on:change={handleProjectChange}
      />
      <button class="w-36 p-2  rounded border border-white hover:ring ring-white cursor-pointer" onclick={handleAddProject}>Add project</button>
    </div>
  </div>
  <div>
    <p>Current Survey/Season:</p>
    <div class="flex gap-2">
      <Select
        bind:value={settings.projectSurvey}
        items={projectSurveys}
        placeholder="Select a survey/season"
        itemId={'surveyID'}
        label={'surveyName'}
        --placeholder-color="oklch(96.8% 0.007 247.896)"
        --background="oklch(44.6% 0.043 257.281)" 
        --list-background="oklch(44.6% 0.043 257.281)"
        --list-border="4px solid white"
        --item-hover-bg="oklch(70.4% 0.04 256.788)"
        --item-hover-color="black"
      />
      <button class="w-36 p-2  rounded border border-white hover:ring ring-white cursor-pointer disabled:hover:ring-0 disabled:border-slate-400 disabled:text-slate-400 disabled:cursor-auto" onclick={handleAddSurvey} disabled={!settings.project}>Add season</button>
    </div>
  </div>
  <div>
    <p>Checklist:</p>
    <div class="flex gap-2">
      <Select
        bind:value={settings.checklist}
        items={checklists}
        placeholder="Select a project checklist"
        itemId={'checklistID'}
        label={'checklistName'}
        --placeholder-color="oklch(96.8% 0.007 247.896)"
        --background="oklch(44.6% 0.043 257.281)" 
        --list-background="oklch(44.6% 0.043 257.281)"
        --list-border="4px solid white"
        --item-hover-bg="oklch(70.4% 0.04 256.788)"
        --item-hover-color="black"
      />
      <!-- Checklists must be added via checklists -->
      <!-- <button class="w-36 p-2  rounded border border-white hover:ring ring-white cursor-pointer" onclick={handleAddChecklist}>Add list</button> -->
    </div>
  </div>
  <div class="flex justify-between gap-4">
    <button class="btn" onclick={() => console.log($state.snapshot(settings))}>Log settings</button>
    <button type="button" class="btn btn-primary" onclick={saveSettings}>Save and back</button>
  </div>
</form>

<style>

  .aligned-fields {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.5rem 1rem;
    align-items: center;
  }

  .aligned-fields label {
    display: contents; /* allows label text and input to align in separate cells */
  }



</style>
