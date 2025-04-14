<script lang="ts">
  import BackButton from '$lib/components/BackButton.svelte';
  import SwipableList from "$lib/components/SwipableList.svelte";
  import ProjectSurveyCard from "./ProjectSurveyCard.svelte";
  import { projectSurveyCollection } from "$lib/db/dexie";
  import type { ProjectSurvey } from "$lib/types/types";

  const { data } = $props()
  const { project, projectSurveys } = data

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