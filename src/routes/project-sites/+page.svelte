<script lang="ts">
  import { toast } from '@zerodevx/svelte-toast';
  import BackButton from '$lib/components/BackButton.svelte';
  import SwipableList from '$lib/components/SwipableList.svelte';
  import ProjectSiteCard from './ProjectSiteCard.svelte';
  import { projectSiteCollection } from '$lib/db/dexie';

  const { data } = $props();
  const { project, projectSites } = data;

  const handleDelete = async (projectSite: Record<string, any>) => {
    try {
      await projectSiteCollection.delete(projectSite.projectSiteID);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error deleting project site: ${error.message}`);
      } else {
        alert(`Error deleting project site: ${error}`);
      }
      return;
    }

    const index = projectSites.findIndex(
      (c) => c.projectSiteID === projectSite.projectSiteID,
    );
    if (index !== -1) {
      projectSites.splice(index, 1);
      toast.push(`Project site deleted`, {
        theme: { '--toastBackground': 'oklch(26.6% 0.079 36.259)' },
      });
    }
  };

  const handleDeleteAll = async () => {
    try {
      await projectSiteCollection.clear();
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error deleting all project sites: ${error.message}`);
      } else {
        alert(`Error deleting all project sites: ${error}`);
      }
      return;
    }

    projectSites.length = 0;
  };
</script>

<main class="p-4 flex flex-col gap-4">
  <BackButton />
  <div>
    <h1 class="text-xl font-bold">Project sites</h1>
    <p>{project?.projectName || ''}</p>
  </div>
  <SwipableList
    items={projectSites}
    ItemComponent={ProjectSiteCard}
    deleteItem={handleDelete}
    deleteAll={handleDeleteAll}
  />
</main>
