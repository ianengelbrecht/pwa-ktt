<script lang="ts">
  import { goto } from '$app/navigation';
  import { toast } from '@zerodevx/svelte-toast';
  import { makeID } from '$lib/utils';
  import ProjectForm from './ProjectForm.svelte';
  import type { Project } from '$lib/types/types';
  import { projectCollection, projectSiteCollection } from '$lib/db/dexie';

  const { data } = $props();
  const { project, user } = data;

  const isNew = project == null;

  let projectRecord: Project = $state({
    projectID: null,
    projectName: null,
    vpCount: 3,
    wtCount: 3,
    dtCount: 3,
    checklistID: null,
    expectedSpeciesProbabilitySource: null,
    warningProbabilityThreshold: null,
    availableTo: [],
    createdBy: null,
    createdDate: new Date().toISOString(),
  });

  if (!isNew) {
    projectRecord = project;
  }

  const projectValidations = (): boolean => {
    const requiredFields: string[] = [];
    if (!projectRecord.projectName || !projectRecord.projectName.trim()) {
      requiredFields.push('Project Name');
    }

    if (!projectRecord.checklistID) {
      requiredFields.push('Checklist');
    }

    if (requiredFields.length) {
      alert('The following fields are required: ' + requiredFields.join(', '));
    }

    return requiredFields.length === 0;
  };

  const handleSaveClick = async () => {
    if (!projectValidations()) {
      return;
    }

    if (isNew) {
      projectRecord.projectID = makeID(10);
    }

    try {
      await projectCollection.put($state.snapshot(projectRecord));
    } catch (err) {
      if (err instanceof Error) {
        alert('Error saving project: ' + err.message);
        return;
      }
    }

    //add the project sites
    if (isNew) {
      let siteCountProperties: Record<string, keyof Project> = {
        VP: 'vpCount',
        WT: 'wtCount',
        DT: 'dtCount',
      };

      try {
        for (const [siteCodePrefix, siteCountProperty] of Object.entries(
          siteCountProperties,
        )) {
          const siteCount = projectRecord[siteCountProperty] as number;
          for (let i = 0; i < siteCount; i++) {
            await projectSiteCollection.add({
              projectSiteID: makeID(10),
              projectID: projectRecord.projectID!,
              siteCode: `${siteCodePrefix}${i + 1}`,
              verbatimLocation: null,
              siteLocation: null,
              thresholdDistance: null,
              sessionOrTransectDuration: 0,
            });
          }
        }

        //add the incidental site
        // this is a special case, so we need to add it separately
        await projectSiteCollection.add({
          projectSiteID: makeID(10),
          projectID: projectRecord.projectID!,
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
    goto(`/project-sites?projectID=${projectRecord.projectID}`);
  };
</script>

<main class="p-4 flex flex-col gap-4">
  <h2 class="text-xl">{isNew ? 'New' : 'Edit'} project</h2>
  <ProjectForm bind:project={projectRecord} />

  {#if !isNew}
    <div class="flex justify-end gap-2">
      <button
        class="btn"
        onclick={() =>
          goto('/project-sites?projectID=' + projectRecord.projectID)}
        >Sites</button
      >
      <button
        class="btn"
        onclick={() =>
          goto('/project-surveys?projectID=' + projectRecord.projectID)}
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
