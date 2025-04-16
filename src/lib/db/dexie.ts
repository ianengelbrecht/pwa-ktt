import { dev } from '$app/environment';
import Dexie from 'dexie';
import type { Table } from 'dexie';

let dbName = 'VPProDatabase';
if (dev) {
  dbName = 'VPProDatabaseDev';
}

import type {
  UserRecord,
  TeamRecord,
  SettingsRecord,
  ChecklistRecord,
  SpeciesRecord,
  //ChecklistMappingRecord
  ExpectedSpeciesRecord,
  ProjectRecord,
  ProjectSiteRecord,
  ProjectSurveyRecord,
  SessionOrTransectRecord,
  ObservationRecord,
} from './types.js'; // update with your actual file path

class AppDatabase extends Dexie {
  users!: Table<UserRecord, string>;
  teams!: Table<TeamRecord, string>;
  settings!: Table<SettingsRecord, string>;
  checklists!: Table<ChecklistRecord, string>;
  species!: Table<SpeciesRecord, string>;
  expectedSpecies!: Table<ExpectedSpeciesRecord, string>;
  //checklistMappings!: Table<ChecklistMapping, string>;
  projects!: Table<ProjectRecord, string>;
  projectSites!: Table<ProjectSiteRecord, string>;
  projectSurveys!: Table<ProjectSurveyRecord, string>;
  sessionsOrTransects!: Table<SessionOrTransectRecord, string>;
  observations!: Table<ObservationRecord, string>;

  constructor() {
    super(dbName);

    this.version(1).stores({
      users: 'userID, firstName, lastName, userInitials',
      teams: 'teamID, teamName',
      settings: 'settingsID',
      checklists: 'checklistID, checklistName',
      species: 'speciesID, checklistID', //no name searches here I'm afraid, we have to do that in code
      expectedSpecies: '[projectID+checklistID+speciesID]',
      //checklistMappings: 'TBC',
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
  users: userCollection,
  teams: teamCollection,
  settings: settingsCollection,
  checklists: checklistCollection,
  species: speciesCollection,
  expectedSpecies: expectedSpeciesCollection,
  //checklistMappings: checklistMappingCollection,
  projects: projectCollection,
  projectSurveys: projectSurveyCollection,
  projectSites: projectSiteCollection,
  sessionsOrTransects: sessionsOrTransectsCollection,
  observations: observationCollection,
} = new AppDatabase();

export {
  userCollection,
  teamCollection,
  settingsCollection,
  checklistCollection,
  speciesCollection,
  expectedSpeciesCollection,
  projectCollection,
  projectSurveyCollection,
  projectSiteCollection,
  sessionsOrTransectsCollection,
  observationCollection,
};
