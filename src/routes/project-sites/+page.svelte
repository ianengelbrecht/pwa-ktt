<script lang="ts">
  import BackButton from '$lib/components/BackButton.svelte';
  import SwipableList from '$lib/components/SwipableList.svelte';
  import ProjectSiteCard from './ProjectSiteCard.svelte';

  const { data } = $props();
  const { project, projectSites } = data;

  const handleDelete = async (projectSite: Record<string, any>) => {
    const index = projectSites.findIndex(
      (c) => c.projectSiteID === projectSite.projectSiteID,
    );
    if (index !== -1) {
      projectSites.splice(index, 1);
    }
  };

  const handleDeleteAll = async () => {
    alert(
      'Cannot delete all project sites. Please delete individually, and proceed with caution!',
    );
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
