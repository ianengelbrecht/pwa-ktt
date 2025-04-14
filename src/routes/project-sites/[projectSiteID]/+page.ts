import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { ProjectSite } from '$lib/types/types';
import { projectCollection, projectSiteCollection} from "$lib/db/dexie";

export const load: PageLoad = async ({ params, url }) => {

  const projectSiteID = params.projectSiteID || null;
  let projectID = url.searchParams.get('projectID') || null;

  if (!projectSiteID) {
    error(400, {
      message: 'Oops, you got here with no projectSiteID! That should not have happened...'
    })
  }

  let projectSite: ProjectSite | null = null

  if (projectSiteID != 'new') {
    projectSite = await projectSiteCollection.get(projectSiteID!) || null
    if (!projectSite) {
      error(500, 'Whoah! There is no projectSite with ID ' + projectSiteID + ' in the database. Something is wrong!');
    }
  }

  if (!projectID) {
    projectID = projectSite?.projectID || null;
    if (!projectID) {
      error(400, {
        message: 'Oops, you got here with no projectID! That should not have happened...'
      })
    }
  }

  let project = await projectCollection.get(projectID)
  if (!project) { 
    error(500, 'Whoah! There is no project with ID ' + projectID + ' in the database. Something is wrong!');
  }

  //get the rest of the project sites, for validations
  const otherProjectSites = await projectSiteCollection
    .where('projectID')
    .equals(projectID)
    .toArray()

  // remove the current project site
  const index = otherProjectSites.findIndex((site) => site.projectSiteID === projectSiteID)
  if (index > -1) {
    otherProjectSites.splice(index, 1)
  }

  return { project, projectSite, otherProjectSites };

}