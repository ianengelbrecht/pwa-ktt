import { dev } from '$app/environment';
import Dexie from 'dexie';
import type { Table } from 'dexie';

let dbName = 'VPProDatabase';
if (dev) {
  dbName = 'VPProDatabaseDev';
}

import type {
  Settings,
  Checklist,
  Species,
  ExpectedSpecies,
  UserProfile,
  Project,
  ProjectSurvey,
  ProjectSite,
  SessionOrTransect,
  Observation,
} from '$lib/types/types'; // update with your actual file path

class AppDatabase extends Dexie {
  settings!: Table<Settings, string>;
  checklists!: Table<Checklist, string>;
  species!: Table<Species, string>;
  expectedSpecies!: Table<ExpectedSpecies, string>;
  users!: Table<UserProfile, string>;
  projects!: Table<Project, string>;
  projectSurveys!: Table<ProjectSurvey, string>;
  projectSites!: Table<ProjectSite, string>;
  sessionsOrTransects!: Table<SessionOrTransect, string>;
  observations!: Table<Observation, string>;

  constructor() {
    super(dbName);

    this.version(1).stores({
      settings: 'settingsID',
      checklists: 'checklistID, checklistName',
      species: 'speciesID, checklistID', //no name searches here I'm afraid, we have to do that in code
      expectedSpecies: '[projectID+checklistID+speciesID]',
      users: 'userID, firstName, lastName, userInitials',
      projects: 'projectID, projectName',
      projectSurveys: 'surveyID, projectID',
      projectSites: 'projectSiteID, projectID',
      sessionsOrTransects: 'sessionOrTransectID, siteID, date',
      observations: 'observationID, projectSurveyID',
    });

    // optional: hooks, compound indexes, etc.
  }
}

// Initialize the database and extract all the collections
const {
  settings: settingsCollection,
  checklists: checklistCollection,
  species: speciesCollection,
  expectedSpecies: expectedSpeciesCollection,
  users: userCollection,
  projects: projectCollection,
  projectSurveys: projectSurveyCollection,
  projectSites: projectSiteCollection,
  sessionsOrTransects: sessionsOrTransectsCollection,
  observations: observationCollection,
} = new AppDatabase();

export {
  settingsCollection,
  checklistCollection,
  speciesCollection,
  expectedSpeciesCollection,
  userCollection,
  projectCollection,
  projectSurveyCollection,
  projectSiteCollection,
  sessionsOrTransectsCollection,
  observationCollection,
};
