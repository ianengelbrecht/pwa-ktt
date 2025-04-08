import Dexie from 'dexie';
import type { Table } from 'dexie';

import type {
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
      checklists: 'checklistID, checklistName',
      species: 'speciesID, checklistID, commonName1',
      users: 'userID',
      projects: 'projectID, projectName',
      projectSurveys: 'surveyID, projectID',
      projectSites: '[projectID+siteID], projectID, siteID',
      siteVisits: 'siteVisitID, siteID, date',
      observations: 'recordID' //cannot index nested objects in IndexedDB, so we'll have to search manually
    });

    // optional: hooks, compound indexes, etc.

  }
}

// Initialize the database and extract all the collections
const { 
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
  checklistCollection,
  speciesCollection,
  userCollection,
  projectCollection,
  projectSurveyCollection,
  projectSiteCollection,
  siteVisitCollection,
  observationCollection
};