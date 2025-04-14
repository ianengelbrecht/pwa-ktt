import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { projectCollection, projectSiteCollection } from '$lib/db/dexie';

export const load: PageLoad = async ({ url }) => {
  const projectID = url.searchParams.get('projectID') || null;

  if (!projectID) {
    error(400, {
      message:
        'Oops, you got here with no projectID! That should not have happened...',
    });
  }

  let project = await projectCollection.get(projectID!);
  if (!project) {
    error(
      500,
      'Whoah! There is no project with ID ' +
        projectID +
        ' in the database. Something is wrong!',
    );
  }

  const projectSites = await projectSiteCollection
    .where('projectID')
    .equals(projectID)
    .sortBy('siteCode');

  return { project, projectSites };
};
