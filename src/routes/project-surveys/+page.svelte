<script lang="ts">
  import { error } from '@sveltejs/kit';
  import { onMount } from 'svelte';
  import { page } from "$app/state";
  import BackButton from '$lib/components/BackButton.svelte';
  import SwipableList from "$lib/components/SwipableList.svelte";
  import ProjectSurveyCard from "./ProjectSurveyCard.svelte";
  import { projectCollection, projectSurveyCollection } from "$lib/db/dexie";
  import type { Project, ProjectSurvey } from "$lib/types/types";

  // make sure we can only get here if we have a projectID
  const projectID = page.url.searchParams.get("projectID");
  if (!projectID) {
    error(403, {
      message: "Oops, you got here with no projectID! That should not have happened...",
    });
  }

  let project: Project | null = $state(null);
  const projectSurveys: ProjectSurvey[] = $state([]);

  onMount(() => {
    //load the project
    projectCollection
    .get(projectID)
    .then((dbProject) => {
      if (!dbProject) {
        error(404, {
          message: "Uh oh! There is no project with ID " + projectID + ". Something is wrong!",
        });
      } else {
        project = dbProject;
      }
    });

    // load the project surveys
    projectSurveyCollection
      .where('projectID')
      .equals(projectID!)
      .toArray()
      .then((projectSurveysFromDB) => {
        console.log('got', projectSurveysFromDB.length, 'surveys');
        projectSurveys.push(...projectSurveysFromDB);
      });
  });

  const handleDelete = async (projectSurvey: Record<string, any>) => {
    await projectSurveyCollection.delete(projectSurvey.surveyID);
    const index = projectSurveys.findIndex((ps) => ps === projectSurvey as ProjectSurvey);
    if (index !== -1) {
      projectSurveys.splice(index, 1);
    }
  };

  const handleDeleteAll = async () => {
    await projectSurveyCollection.clear();
    projectSurveys.length = 0
  };


</script>

<main class="p-4 flex flex-col gap-4">
  <BackButton />
  <div>
    <h1 class="text-xl font-bold">Project surveys</h1>
    <p>{project?.projectName || ''}</p>
  </div>
  <SwipableList
    items={projectSurveys}
    deleteItem={handleDelete}
    deleteAll={handleDeleteAll}
    ItemComponent={ProjectSurveyCard}
    sortable={true}
  />
</main>