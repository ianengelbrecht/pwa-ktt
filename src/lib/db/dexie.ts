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
      checklists: 'checklistID',
      species: '[checklistID+speciesID], checklistID, speciesID',
      users: 'userID',
      projects: 'projectID',
      projectSurveys: 'surveyID, projectID',
      projectSites: '[projectID+siteID], projectID, siteID',
      siteVisits: 'siteVisitID, siteID, date',
      observations: 'recordID, date, observerInitials'
    });

    // optional: hooks, compound indexes, etc.
  }
}

export const db = new AppDatabase();
