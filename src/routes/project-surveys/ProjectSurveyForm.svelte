<script lang="ts">
  import {onMount} from "svelte";
  import { toast } from '@zerodevx/svelte-toast'
  import type { Project, ProjectSurvey } from "$lib/types/types";
  import { projectCollection, projectSurveyCollection } from "$lib/db/dexie";
  import nanoid from "$lib/utils/nanoid";

  const { projectID }: { projectID: string } = $props()
  let project = $state({}) as Project

  const projectSurvey: ProjectSurvey = $state({
    surveyID: null,
    projectID: null,
    surveyName: null,
    season: null,
    startDate: null,
    endDate: null
  });

  onMount(async () => {
    // load the project
    const projectFromDB = await projectCollection.where('projectID').equals(projectID).toArray();
    if (projectFromDB.length > 0) {
      project = projectFromDB[0];
    } 
  });

  const validateProjectSurvey = () => {
    const missingFields = []
    if (!projectSurvey.surveyName) {
      missingFields.push("surveyName")
    }
    if (!projectSurvey.season) {
      missingFields.push("season")
    }
    if (!projectSurvey.startDate) {
      missingFields.push("startDate")
    }
    if (!projectSurvey.endDate) {
      missingFields.push("endDate")
    }

    if (missingFields.length) {
      alert(`Please fill in the following fields: ${missingFields.join(", ")}`)
      return false
    }

    if (projectSurvey.startDate! > projectSurvey.endDate!) {
      alert("Start date cannot be after end date")
      return false
    }

    return true;
  }

  const handleSaveClick = async (ev: Event) => {
    ev.preventDefault()
    if (!validateProjectSurvey()) {
      return
    }

    if (!projectSurvey.surveyID) {
      projectSurvey.surveyID = nanoid(10);
    }

    if (!projectSurvey.projectID) {
      projectSurvey.projectID = projectID;
    }

    try {
      await projectSurveyCollection.add($state.snapshot(projectSurvey));
      toast.push('record saved')

      //clear the record
      projectSurvey.surveyID = null;
      projectSurvey.surveyName = null;
      projectSurvey.season = null;
      projectSurvey.startDate = null;
      projectSurvey.endDate = null;
    }
    catch (err) {
      if (err instanceof Error) {
        console.log(err)
        alert('Error saving record: ' + err.message);
      }
    }
  };

</script>

<div class="p-4 ">
  <form class="flex flex-col gap-4">
    <h2 class="text-2xl">Project Survey</h2>
    <p>Project: {project.projectName}</p>
    <label>
      Survey Name
      <input type="text" bind:value={projectSurvey.surveyName} placeholder="Survey Name" class="w-full input-base" />
    </label>
    <label>
      Season
      <input type="text" bind:value={projectSurvey.season} placeholder="Season" class="w-full input-base" />
    </label>
    <div class="flex gap-2">
      <label>
        Start Date
        <input type="date" bind:value={projectSurvey.startDate} class="input-base" />
      </label>
      <label>
        End Date
        <input type="date" bind:value={projectSurvey.endDate} class="input-base" />
      </label>
    </div>
    <div class="flex justify-between">
      <button class="w-24 btn " onclick={() => window.history.back()}>Done</button>
      <button class="w-24 btn btn-primary"  onclick={handleSaveClick} >Save</button>
    </div>
  </form>
</div>