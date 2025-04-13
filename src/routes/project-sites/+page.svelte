<script lang="ts">
  import { error } from '@sveltejs/kit';
  import { page } from "$app/state";
  import SwipableList from "$lib/components/SwipableList.svelte";
  import ProjectSiteCard from "./ProjectSiteCard.svelte";
  import type { Project, ProjectSite } from "$lib/types/types";
  import { projectCollection, projectSiteCollection } from "$lib/db/dexie";

  const projectID = page.url.searchParams.get('projectID') || null;
    
  if (!projectID) {
    error(403, {
      message: 'Oops, you got here with no projectID! That should not have happened...'
    })
  }

  let project: Project | null = $state(null)
  projectCollection.get(projectID!).then(dbProject => {
    if (!dbProject) {
      error(404, 'Uh oh! There is no project with ID ' + projectID + '. Something is wrong!');
    }
    project = dbProject;
  });


  const projectSites: ProjectSite[] = $state([]);
  projectSiteCollection
    .where('projectID')
    .equals(projectID)
    .sortBy('siteCode')
    .then((sites) => {
      projectSites.push(...sites);
    });


  const handleDelete = async (projectSite: Record<string, any>) => {
    const index = projectSites.findIndex((c) => c.projectSiteID === projectSite.projectSiteID);
    if (index !== -1) {
      projectSites.splice(index, 1);
    }
  };

  const handleDeleteAll = async () => {
    alert("Cannot delete all project sites. Please delete individually, and proceed with caution!");
  }; 

</script>

<main class="p-4 flex flex-col gap-4">
  <h1 class="text-lg font-bold">{project?.projectName || ''}</h1>
  <SwipableList items={projectSites} ItemComponent={ProjectSiteCard} deleteItem={handleDelete} deleteAll={handleDeleteAll} />
</main>