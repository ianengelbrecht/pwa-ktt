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
  Observation,
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
    super('VPProDatabase');

    this.version(1).stores({
      settings: 'settingsID',
      checklists: 'checklistID, checklistName',
      species: 'speciesID, checklistID', //no name searches here I'm afraid, we have to do that in code
      users: 'userID, firstName, lastName, userInitials',
      projects: 'projectID, projectName',
      projectSurveys: 'surveyID, projectID',
      projectSites: 'projectSiteID, projectID',
      siteVisits: 'siteVisitID, siteID, date',
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
  users: userCollection,
  projects: projectCollection,
  projectSurveys: projectSurveyCollection,
  projectSites: projectSiteCollection,
  siteVisits: siteVisitCollection,
  observations: observationCollection,
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
  observationCollection,
};
