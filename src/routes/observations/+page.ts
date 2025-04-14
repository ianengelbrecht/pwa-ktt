import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type {
  Settings,
  Observation,
  ObservationSummary,
} from '$lib/types/types';
import { settingsCollection, observationCollection } from '$lib/db/dexie';

export const load: PageLoad = async () => {
  let settings: Settings;
  try {
    const settingsArray = await settingsCollection.toArray();
    settings = settingsArray[0] || null;
  } catch (e) {
    console.error('Error loading settings:', e);
    if (e instanceof Error) {
      error(500, 'Error fetching settings: ' + e.message);
    } else {
      error(500, 'Error fetching settings: ' + e);
    }
  }

  if (!settings) {
    //redirect to error page
    error(403, 'Settings not found');
  }

  if (!settings.project || !settings.project.projectID) {
    error(400, 'Project must be added in settings first...');
  }

  if (!settings.projectSurvey || !settings.projectSurvey.surveyID) {
    error(400, 'Project season/survey must be added in settings first...');
  }

  let observations: Observation[] = [];
  try {
    observations = await observationCollection
      .where('projectSurveyID')
      .equals(settings.projectSurvey!.surveyID!)
      .toArray();
  } catch (e) {
    if (e instanceof Error) {
      error(500, 'Error fetching observations: ' + e.message);
    } else {
      error(500, 'Error fetching observations: ' + e);
    }
  }

  const summarizedObservations: ObservationSummary[] = observations.map(
    (obs): ObservationSummary => {
      return {
        observationID: obs.observationID,
        speciesName: obs.species?.commonName1 || null, // assuming species is an object with commonName1 property
        location: obs.location,
        locationAccuracy: obs.locationAccuracy,
        siteCode: obs.projectSite, // assuming projectSite is a string
        date: obs.date,
        time: obs.time,
        observerInitials: obs.observerInitials,
      };
    },
  );

  return { settings, summarizedObservations };
};
