<script lang="ts">
  import { toast } from '@zerodevx/svelte-toast'
  import { onMount } from "svelte";
  import nanoid from "$lib/utils/nanoid";
  import type { Project } from "$lib/types/types";
  import { projectCollection, projectSiteCollection, settingsCollection } from "$lib/db/dexie";

  const project: Project = $state({
    projectID: null,
    projectName: null,
    vpCount: 3,
    wtCount: 3,
    dtCount: 3,
    createdBy: null,
    createdDate: new Date().toISOString()
  })

  onMount(async () => {
    const settingsFromDB = await settingsCollection.toArray();
    if (settingsFromDB.length > 0) {
      project.createdBy = settingsFromDB[0].user!.userID;
    }
  });

  const handleSaveClick = async () => {
    if (!project.projectName) {
      alert("Please enter a project name");
      return;
    }

    project.projectID = nanoid(10);
    
    try {

      await projectCollection.add($state.snapshot(project));
      toast.push('Project saved')

      //clear the record
      project.projectID = null;
      project.projectName = null;
      project.vpCount = 3;
      project.wtCount = 3;
      project.dtCount = 3;
      project.createdDate = new Date().toISOString();

    }
    catch (err) {
      if (err instanceof Error) {
        alert("Error saving project: " + err.message);
        return;
      }
    }

    //add the project sites
    for (let i = 0; i < project.vpCount; i++) {
      await projectSiteCollection.add({
        siteID: nanoid(10),
        projectID: project.projectID!,
        siteCode: `VP ${i + 1}`,
        siteLocation: null,
        thresholdDistance: null
      });
    }

    for (let i = 0; i < project.wtCount; i++) {
      await projectSiteCollection.add({
        siteID: nanoid(10),
        projectID: project.projectID!,
        siteCode: `WT ${i + 1}`,
        siteLocation: null,
        thresholdDistance: null
      });
    }

    for (let i = 0; i < project.dtCount; i++) {
      await projectSiteCollection.add({
        siteID: nanoid(10),
        projectID: project.projectID!,
        siteCode: `DT ${i + 1}`,
        siteLocation: null,
        thresholdDistance: null
      });
    }

    await projectSiteCollection.add({
        siteID: nanoid(10),
        projectID: project.projectID!,
        siteCode: `incidental`,
        siteLocation: null,
        thresholdDistance: null
      });

  };
  
</script>

<div class="p-4">
  <h2 class="text-xl">New project</h2>
  <form class="flex flex-col gap-2">
    <label>
      Project name:
      <input type="text" class="w-full input-base" bind:value={project.projectName} />
    </label>
    <div class="flex justify-between">
      <label>
        VPs:
        <input type="number" class="w-full input-base" min="0" bind:value={project.vpCount}>
      </label>
      <label>
        WTs:
        <input type="number" class="w-full input-base" min="0" bind:value={project.wtCount}>
      </label>
      <label>
        DTs:
        <input type="number" class="w-full input-base" min="0" bind:value={project.dtCount}>
      </label>
    </div>
    <div class="flex justify-between mt-2">
      <button class="w-24 p-4 border rounded border-white  cursor-pointer" onclick={() => window.history.back()}>Cancel</button>
      <button class="w-24 p-4 border rounded border-white bg-green-400 cursor-pointer" onclick={handleSaveClick}>Save</button>
    </div>
  </form>
</div>