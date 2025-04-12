import Dexie from 'dexie';
import type { Table } from 'dexie';

import type {
  Settings,
  Checklist,
  Species,
  UserProfile,
  Project,
  ProjectSurvey,
  ProjectSite,
  SiteVisit,
  Observation
} from '$lib/types/types'; // update with your actual file path

class AppDatabase extends Dexie {
  settings!: Table<Settings, string>;
  checklists!: Table<Checklist, string>;
  species!: Table<Species, string>;
  users!: Table<UserProfile, string>;
  projects!: Table<Project, string>;
  projectSurveys!: Table<ProjectSurvey, string>;
  projectSites!: Table<ProjectSite, string>;
  siteVisits!: Table<SiteVisit, string>;
  observations!: Table<Observation, string>;

  constructor() {
    super('AppDatabase');

    this.version(1).stores({
      settings: 'settingsID',
      checklists: 'checklistID, checklistName',
      species: 'speciesID, checklistID, commonName1', //also have to search for species manually because we don't do regex searches in indexeddb, for now...
      users: 'userID',
      projects: 'projectID, projectName',
      projectSurveys: 'surveyID, projectID',
      projectSites: 'projectSiteID, projectID',
      siteVisits: 'siteVisitID, siteID, date',
      observations: 'observationID' //cannot index nested objects in IndexedDB, so we'll have to search manually
    });

    // optional: hooks, compound indexes, etc.

  }
}

// Initialize the database and extract all the collections
const { 
  settings: settingsCollection,
  checklists: checklistCollection,
  species: speciesCollection,
  users: userCollection,
  projects: projectCollection,
  projectSurveys: projectSurveyCollection,
  projectSites: projectSiteCollection,
  siteVisits: siteVisitCollection,
  observations: observationCollection
} = new AppDatabase();


 export {
  settingsCollection,
  checklistCollection,
  speciesCollection,
  userCollection,
  projectCollection,
  projectSurveyCollection,
  projectSiteCollection,
  siteVisitCollection,
  observationCollection
};