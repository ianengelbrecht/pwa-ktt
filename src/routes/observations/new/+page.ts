import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { ProjectSite, Species } from '$lib/types/types';
import { settingsCollection, projectSiteCollection, speciesCollection } from "$lib/db/dexie";

export const load: PageLoad = async () => {
  
  const settingsArray = await settingsCollection.toArray()
  const settings = settingsArray[0] || null
  if (!settings) {
    //redirect to error page
    error(403, 'Settings not found');
  }

  let projectSites: ProjectSite[] = []
  if (!settings.project) {
    error(403, 'Project not set in settings');
  }
  else {
    projectSites = await projectSiteCollection
    .where('projectID')
    .equals(settings.project?.projectID!)
    .toArray()
  }

  let species: Species[] = []
  if (!settings.checklist) {
    error(403, 'Species checklist not set in settings');
  }
  else {
    species = await speciesCollection
    .where('checklistID')
    .equals(settings.checklist?.checklistID!)
    .toArray()

    species.sort((a, b) => {
      const nameA = (a.commonName1 || '').toLowerCase();
      const nameB = (b.commonName1 || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

	return { projectSites, species };
};