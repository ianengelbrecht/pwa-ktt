<script lang="ts">
  import { error } from '@sveltejs/kit';
  import { page } from "$app/state";
  import { toast } from '@zerodevx/svelte-toast'
  import { makeID } from '$lib/utils';
  import ProjectSurveyForm from "../ProjectSurveyForm.svelte";
  import type { Project, ProjectSurvey } from "$lib/types/types";
  import { projectCollection, projectSurveyCollection } from "$lib/db/dexie";

  
  // make sure we can only get here if we have a projectID
  const projectID = page.url.searchParams.get("projectID");
  if (!projectID) {
    error(403, {
      message: "Oops, you got here with no projectID! That should not have happened..."
    });
  }

  let project: Project | null = $state(null);

  projectCollection
    .get(projectID)
    .then(dbProject => {
      if (!dbProject) {
        error(404, 'Uh oh! There is no project with ID ' + projectID + '. Something is wrong!');
      }
      project = dbProject;
    });

  // new or edit
  const isNew = page.params.projectSurveyID == 'new'

  let projectSurvey: ProjectSurvey = $state({
    surveyID: null,
    projectID: null,
    surveyName: null,
    season: null,
    startDate: null,
    endDate: null
  });

  if (!isNew) {
    projectSurveyCollection
      .get(page.params.projectSurveyID)
      .then(dbProjectSurvey => {
        if (!dbProjectSurvey) {
          error(404, 'Uh oh! There is no project survey with ID ' + page.params.projectSurveyID + '. Something is wrong!');
        }
        projectSurvey = dbProjectSurvey;
      });
  }

  // yay! now we can keep all this logic in the UI component!
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

    
    if (isNew) {
      projectSurvey.surveyID = makeID(10);
      projectSurvey.projectID = projectID;
    }

    try {
      await projectSurveyCollection.put($state.snapshot(projectSurvey));
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
      projectSurvey.surveyID = null;
      projectSurvey.surveyName = null;
      projectSurvey.season = null;
      projectSurvey.startDate = null;
      projectSurvey.endDate = null;
    }
    
  };

</script>
<main class="p-4 flex flex-col gap-4">
  <div>
    <h2 class="text-xl">{ isNew ? 'New' : 'Edit' } Survey/Season</h2>
    <p class="text-sm">{ project?.projectName || 'no name' }</p>
  </div>
  <ProjectSurveyForm bind:projectSurvey />
  <div class="flex justify-between">
    <button class="w-24 btn " onclick={() => window.history.back()}>{ isNew ? 'Done' : 'Cancel'}</button>
    <button class=" btn btn-primary"  onclick={handleSaveClick} >Save{ isNew ? ' and new' : ''}</button>
  </div>
</main>