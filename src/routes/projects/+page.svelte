<script lang="ts">
  import type { Project } from '$lib/types/types';
  import BackButton from '$lib/components/BackButton.svelte';
  import SwipableList from '$lib/components/SwipableList.svelte';
  import ProjectCard from './ProjectCard.svelte';
  import { projectCollection } from '$lib/db/dexie';

  const { data } = $props();
  const { projects } = data;

  const handleDelete = async (project: Record<string, any>) => {
    await projectCollection.delete(project.projectID);
    const index = projects.findIndex((c) => c === (project as Project));
    if (index !== -1) {
      projects.splice(index, 1);
    }
  };
</script>

<main class="p-4">
  <BackButton />
  <h1 class="text-lg font-bold">Projects</h1>
  <SwipableList
    items={projects}
    deleteItem={handleDelete}
    ItemComponent={ProjectCard}
    sortable={true}
  />
</main>
