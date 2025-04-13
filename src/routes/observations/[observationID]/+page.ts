import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Settings, ProjectSite, Species } from '$lib/types/types';
import { settingsCollection, projectSiteCollection, speciesCollection } from "$lib/db/dexie";

export const load: PageLoad = async ({ params }) => {

  const observationID = params.observationID;

  let settings: Settings
  try {
    const settingsArray = await settingsCollection.toArray()
    settings = settingsArray[0] || null
  }
  catch (e) {
    console.error('Error loading settings:', e);
    if (e instanceof Error) {
      error(500, 'Error fetching settings: ' + e.message);
    }
    else {
      error(500, 'Error fetching settings: ' + e);
    }
  }

  //validations
  if (!settings) {
    //redirect to error page
    error(400, 'Settings not found');
  }

  if (!settings.user || !settings.user.userInitials) {
    error(400, 'User details not set in settings');
  }

  if (!settings.project || !settings.project.projectID) {
    error(400, 'Project must be added in settings first...');
  }

  if (!settings.projectSurvey || !settings.projectSurvey.surveyID) {
    error(400, 'Project season/survey must be added in settings first...');
  }

  if (!settings.checklist || !settings.checklist.checklistID) {
    error(400, 'Species checklist must be added in settings first...');
  }

  let projectSites: ProjectSite[] = []
  try {
    projectSites = await projectSiteCollection
    .where('projectID')
    .equals(settings.project?.projectID!)
    .toArray()
  }
  catch (e) {
    if (e instanceof Error) {
      error(500, 'Error fetching project sites: ' + e.message);
    }
    else {
      error(500, 'Error fetching project sites: ' + e);
    }
  }

  let species: Species[] = []
  try {
    species = await speciesCollection
    .where('checklistID')
    .equals(settings.checklist!.checklistID!)
    .toArray()

    species.sort((a, b) => {
      const nameA = (a.commonName1 || '').toLowerCase();
      const nameB = (b.commonName1 || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }
  catch (e) {
    if (e instanceof Error) {
      error(500, 'Error fetching species: ' + e.message);
    }
    else {
      error(500, 'Error fetching species: ' + e);
    }
  }

	return {observationID, settings, projectSites, species };

};