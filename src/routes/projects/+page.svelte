<script lang="ts">
  import { toast } from '@zerodevx/svelte-toast';
  import BackButton from '$lib/components/BackButton.svelte';
  import SwipableList from '$lib/components/SwipableList.svelte';
  import ProjectCard from './ProjectCard.svelte';
  import { projectCollection } from '$lib/db/dexie';

  const { data } = $props();
  const { projects } = data;

  const handleDelete = async (project: Record<string, any>) => {
    try {
      await projectCollection.delete(project.projectID);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error deleting project: ${error.message}`);
      } else {
        alert(`Error deleting project: ${error}`);
      }
      return;
    }

    const index = projects.findIndex((c) => c.projectID === project.projectID);
    if (index !== -1) {
      projects.splice(index, 1);
      toast.push(`Record deleted`, {
        theme: { '--toastBackground': 'oklch(26.6% 0.079 36.259)' },
      });
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
