<script lang="ts">
  import { onMount } from "svelte";
  import type {Project } from "$lib/types/types";
  import SwipableList from "$lib/components/SwipableList.svelte";
  import ProjectCard from "./ProjectCard.svelte";
  import { projectCollection } from "$lib/db/dexie";

  const projects: Project[] = $state([]);

  onMount(async () => {
    const projectsFromDB = await projectCollection.toArray();
    projects.push(...projectsFromDB);
  });

  const handleDelete = async (project: Record<string, any>) => {
    await projectCollection.delete(project.projectID);
    const index = projects.findIndex((c) => c === project as Project);
    if (index !== -1) {
      projects.splice(index, 1);
    }
  };

  const handleDeleteAll = async () => {
    alert("Cannot delete all projects. Please delete individually, and proceed with caution!");
  };

</script>

<main class="p-4">

  <SwipableList
    items={projects}
    deleteItem={handleDelete}
    ItemComponent={ProjectCard}
    deleteAll={handleDeleteAll}
    sortable={true}
  />
</main>