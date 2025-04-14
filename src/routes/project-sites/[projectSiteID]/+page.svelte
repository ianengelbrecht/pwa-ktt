<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { makeID } from "$lib/utils";
  import type { ProjectSite } from "$lib/types/types";
  import { projectSiteCollection } from "$lib/db/dexie";
  import ProjectSiteForm from "./ProjectSiteForm.svelte";

  const { data } = $props();
  const { project, projectSite, otherProjectSites } = data;

  const isNew = projectSite == null

  let projectSiteRecord: ProjectSite = $state({
    projectSiteID: null,
    projectID: project.projectID,
    siteCode: null,
    verbatimLocation: null,
    siteLocation: null,
    thresholdDistance: null,
    sessionOrTransectDuration: null,
  })

  if (projectSite) {
    projectSiteRecord = projectSite;
  } 

  const siteCodeValidation = () => {
    // check if the site code is used in otherProjectSites
    if (otherProjectSites.some((site) => site.siteCode?.trim().toLowerCase().replace(/\s+/g, '') === projectSiteRecord.siteCode?.trim().toLowerCase().replace(/\s+/g, ''))) {
      toast.push(`Site code ${projectSiteRecord.siteCode} already exists`, { theme: { "--toastBackground": "red" } });
      return false;
    }
    return true;
  }

  const validateProjectSiteRecord = () => {
    const missingFields = []
    if (!projectSiteRecord.siteCode || projectSiteRecord.siteCode.trim() === "") {
      missingFields.push("Site code")
    }

    if (otherProjectSites.some((site) => site.siteCode === projectSiteRecord.siteCode)) {
      toast.push("Site code already exists", { theme: { "--toastBackground": "red" } });
      return false;
    }
    return true;
  }

  const handleSaveClick = async (ev: Event) => {
    ev.preventDefault()
    if (![siteCodeValidation()].every(x => x)) return;
    if (!validateProjectSiteRecord()) return;

    if (isNew) {
      projectSiteRecord.projectSiteID = makeID();
    } 

    try {
      await projectSiteCollection.put($state.snapshot(projectSiteRecord));
      toast.push(`Project site ${projectSiteRecord.siteCode} saved`);
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error saving project site: ${err.message}`);
      } else {
        alert(`Error saving project site: ${err}`);
      }
    }

    if (isNew) {
      projectSiteRecord.projectSiteID = null
      projectSiteRecord.siteCode = null
      projectSiteRecord.verbatimLocation = null
      projectSiteRecord.siteLocation = null
      projectSiteRecord.thresholdDistance = null
      projectSiteRecord.sessionOrTransectDuration = null
    }
    else {
      window.history.back();
    }
  };

</script>

<main class="p-4 flex flex-col gap-4">
  <div>
    <h1 class="text-lg font-bold">{isNew ? 'New' : 'Edit'} project site</h1>
    <p>{project.projectName}</p>
  </div>
  <ProjectSiteForm projectSite={projectSiteRecord}  />
  <div class="flex justify-between">
    <button class="btn" onclick={() => window.history.back()}>{ isNew ? 'Done' : 'Cancel'}</button>
    <button class="btn btn-primary" onclick={handleSaveClick}>Save { isNew ? ' and new' :  ''}</button>
  </div>
</main>