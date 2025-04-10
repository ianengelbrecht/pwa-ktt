import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { ProjectSite } from '$lib/types/types';
import { settingsCollection, projectSiteCollection } from "$lib/db/dexie";

export const load: PageLoad = async ({ url }) => {
  const settingsArray = await settingsCollection.toArray()
  const settings = settingsArray[0] || null
  if (!settings) {
    //redirect to error page
    error(403, 'Settings not found');
  }

  let projectSites: ProjectSite[] = []
  if (settings.project) {
    projectSites = await projectSiteCollection
    .where('projectID')
    .equals(settings.project?.projectID!)
    .toArray()
  }

	return {settings, projectSites};
};