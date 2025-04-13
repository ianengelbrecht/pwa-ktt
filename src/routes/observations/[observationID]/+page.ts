import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Settings, ProjectSite, Species, Observation } from '$lib/types/types';
import { settingsCollection, projectSiteCollection, speciesCollection, observationCollection } from "$lib/db/dexie";

export const load: PageLoad = async ({ params }) => {

  const observationID = params.observationID;

  let settings: Settings
  let projectSites: ProjectSite[] = []
  let species: Species[] = []
  let observation : Observation | null = null

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

  if (observationID != 'new') {
    try {
      observation = await observationCollection.get(observationID) || null
      if (!observation) {
        //redirect to error page
        error(500, `Whoah! The observation with ID ${observationID} does not exist in the database!`);
      }
    }
    catch (e) {
      if (e instanceof Error) {
        error(500, 'Error getting observation from database:' + e.message);
      }
      else {
        error(500, 'Error getting observation from database:' + e);
      }
    }
  }

	return {observation, settings, projectSites, species };

};