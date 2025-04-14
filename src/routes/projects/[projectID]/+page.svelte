<script lang="ts">
  import { error } from '@sveltejs/kit';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { toast } from '@zerodevx/svelte-toast';
  import { makeID } from '$lib/utils';
  import ProjectForm from './ProjectForm.svelte';
  import type { Project } from '$lib/types/types';
  import {
    projectCollection,
    projectSiteCollection,
    settingsCollection,
  } from '$lib/db/dexie';

  // make sure we can only get here if we have a projectID
  const projectID = page.params.projectID;
  if (!projectID) {
    error(403, {
      message:
        'Oops, you got here with no projectID! That should not have happened...',
    });
  }

  let project: Project = $state({
    projectID: null,
    projectName: null,
    vpCount: 3,
    wtCount: 3,
    dtCount: 3,
    createdBy: null,
    createdDate: new Date().toISOString(),
  });

  const isNew = page.params.projectID == 'new';

  onMount(async () => {
    if (isNew) {
      const settingsFromDB = await settingsCollection.toArray();
      if (settingsFromDB.length > 0) {
        project.createdBy = settingsFromDB[0].user!.userInitials;
      }
    } else {
      const dbProject = await projectCollection.get(projectID);
      if (!dbProject) {
        error(
          404,
          'Uh oh! There is no project with ID ' +
            projectID +
            '. Something is wrong!',
        );
      } else {
        project = dbProject;
      }
    }
  });

  const projectValidations = () => {
    if (!project.projectName || !project.projectName.trim()) {
      alert('Project name is required');
      return false;
    }

    return true;
  };

  const handleSaveClick = async () => {
    if (!projectValidations()) {
      return;
    }

    if (isNew) {
      project.projectID = makeID(10);
    }

    try {
      await projectCollection.put($state.snapshot(project));
    } catch (err) {
      if (err instanceof Error) {
        alert('Error saving project: ' + err.message);
        return;
      }
    }

    if (isNew) {
      try {
        //add the project sites
        for (let i = 0; i < project.vpCount; i++) {
          await projectSiteCollection.add({
            projectSiteID: makeID(10),
            projectID: project.projectID!,
            siteCode: `VP${i + 1}`,
            verbatimLocation: null,
            siteLocation: null,
            thresholdDistance: null,
            sessionOrTransectDuration: 0,
          });
        }

        for (let i = 0; i < project.wtCount; i++) {
          await projectSiteCollection.add({
            projectSiteID: makeID(10),
            projectID: project.projectID!,
            siteCode: `WT${i + 1}`,
            verbatimLocation: null,
            siteLocation: null,
            thresholdDistance: null,
            sessionOrTransectDuration: 0,
          });
        }

        for (let i = 0; i < project.dtCount; i++) {
          await projectSiteCollection.add({
            projectSiteID: makeID(10),
            projectID: project.projectID!,
            siteCode: `DT${i + 1}`,
            verbatimLocation: null,
            siteLocation: null,
            thresholdDistance: null,
            sessionOrTransectDuration: 0,
          });
        }

        await projectSiteCollection.add({
          projectSiteID: makeID(10),
          projectID: project.projectID!,
          siteCode: `incidental`,
          verbatimLocation: null,
          siteLocation: null,
          thresholdDistance: null,
          sessionOrTransectDuration: 0,
        });
      } catch (err) {
        if (err instanceof Error) {
          alert('Error saving project sites: ' + err.message);
        } else {
          alert('Unknown error saving project sites');
        }
        return;
      }
    }

    toast.push('Project saved');
    goto(`/project-sites?projectID=${project.projectID}`);
  };
</script>

<main class="p-4 flex flex-col gap-4">
  <h2 class="text-xl">{isNew ? 'New' : 'Edit'} project</h2>
  <ProjectForm bind:project />

  {#if !isNew}
    <div class="flex justify-end gap-2">
      <button
        class="btn"
        onclick={() => goto('/project-sites?projectID=' + projectID)}
        >Sites</button
      >
      <button
        class="btn"
        onclick={() => goto('/project-surveys?projectID=' + projectID)}
        >Surveys</button
      >
    </div>
  {/if}
  <div class="flex justify-between mt-2">
    <button class="btn" onclick={() => window.history.back()}
      >{isNew ? 'Cancel' : 'Done'}</button
    >
    <button class="btn btn-primary" onclick={handleSaveClick}>Save</button>
  </div>
</main>
