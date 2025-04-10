<script lang="ts">
  import {onMount} from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import SwipableList from "$lib/components/SwipableList.svelte";
  import ProjectSurveyCard from "./ProjectSurveyCard.svelte";
  import { projectSurveyCollection } from "$lib/db/dexie";
  import type { ProjectSurvey } from "$lib/types/types";

  // make sure we can only get here if we have a projectID
  const projectID = page.url.searchParams.get("projectID");
  if (!projectID) {
    //redirect to 400 error page
    goto('/error', { replaceState: true })
  }

  const projectSurveys: ProjectSurvey[] = $state([]);

  onMount(async () => {
    // load the project surveys
    const projectSurveysFromDB = await projectSurveyCollection.where('projectID').equals(projectID!).toArray();
    projectSurveys.push(...projectSurveysFromDB);
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

<SwipableList
  items={projectSurveys}
  itemIDfield={'surveyID'}
  deleteItem={handleDelete}
  deleteAll={handleDeleteAll}
  ItemComponent={ProjectSurveyCard}
  sortable={true}
/>