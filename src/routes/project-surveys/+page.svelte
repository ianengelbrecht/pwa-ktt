<script lang="ts">
  import { toast } from '@zerodevx/svelte-toast';
  import BackButton from '$lib/components/BackButton.svelte';
  import SwipableList from '$lib/components/SwipableList.svelte';
  import ProjectSurveyCard from './ProjectSurveyCard.svelte';
  import { projectSurveyCollection } from '$lib/db/dexie';
  import type { ProjectSurvey } from '$lib/types/types';

  const { data } = $props();
  const { project, projectSurveys } = data;

  const handleDelete = async (projectSurvey: Record<string, any>) => {
    try {
      await projectSurveyCollection.delete(projectSurvey.surveyID);
    } catch (e) {
      if (e instanceof Error) {
        alert(`Error deleting project survey: ${e.message}`);
      } else {
        alert(`Error deleting project survey: ${e}`);
      }
      return;
    }

    const index = projectSurveys.findIndex(
      (ps) => ps.surveyID === projectSurvey.surveyID,
    );
    if (index !== -1) {
      projectSurveys.splice(index, 1);
      toast.push(`Project survey deleted`, {
        theme: { '--toastBackground': 'oklch(26.6% 0.079 36.259)' },
      });
    }
  };

  const handleDeleteAll = async () => {
    await projectSurveyCollection.clear();
    projectSurveys.length = 0;
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
