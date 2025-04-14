<script lang="ts">
  import { toast } from '@zerodevx/svelte-toast'
  import { makeID } from '$lib/utils';
  import ProjectSurveyForm from "./ProjectSurveyForm.svelte";
  import type { ProjectSurvey } from "$lib/types/types";
  import { projectSurveyCollection } from "$lib/db/dexie";

  const { data } = $props()
  const { project, projectSurvey, projectID } = data
  
  // new or edit
  const isNew = projectSurvey == null

  let projectSurveyRecord: ProjectSurvey = $state({
    surveyID: null,
    projectID: null,
    surveyName: null,
    season: null,
    startDate: null,
    endDate: null
  });

  if (!isNew) {
    projectSurveyRecord = projectSurvey
  }

  // yay! now we can keep all this logic in the UI component!
  const validateProjectSurvey = () => {
    const missingFields = []
    if (!projectSurveyRecord.surveyName) {
      missingFields.push("surveyName")
    }
    if (!projectSurveyRecord.season) {
      missingFields.push("season")
    }
    if (!projectSurveyRecord.startDate) {
      missingFields.push("startDate")
    }
    if (!projectSurveyRecord.endDate) {
      missingFields.push("endDate")
    }

    if (missingFields.length) {
      alert(`Please fill in the following fields: ${missingFields.join(", ")}`)
      return false
    }

    if (projectSurveyRecord.startDate! > projectSurveyRecord.endDate!) {
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

    
    if (isNew) {
      projectSurveyRecord.surveyID = makeID(10);
      projectSurveyRecord.projectID = projectID;
    }

    try {
      await projectSurveyCollection.put($state.snapshot(projectSurveyRecord));
      toast.push('record saved')
    }
    catch (err) {
      if (err instanceof Error) {
        console.log(err)
        alert('Error saving record: ' + err.message);
      }
    }

    if (!isNew) {
      window.history.back()
    }
    else {
      //clear the record
      projectSurveyRecord.surveyID = null;
      projectSurveyRecord.surveyName = null;
      projectSurveyRecord.season = null;
      projectSurveyRecord.startDate = null;
      projectSurveyRecord.endDate = null;
    }
    
  };

</script>
<main class="p-4 flex flex-col gap-4">
  <div>
    <h2 class="text-xl">{ isNew ? 'New' : 'Edit' } Survey/Season</h2>
    <p class="text-sm">{ project?.projectName || 'no name' }</p>
  </div>
  <ProjectSurveyForm bind:projectSurvey={projectSurveyRecord} />
  <div class="flex justify-between">
    <button class="w-24 btn " onclick={() => window.history.back()}>{ isNew ? 'Done' : 'Cancel'}</button>
    <button class=" btn btn-primary"  onclick={handleSaveClick} >Save{ isNew ? ' and new' : ''}</button>
  </div>
</main>