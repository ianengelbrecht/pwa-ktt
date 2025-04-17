import type {
  UserRecord,
  TeamRecord,
  SettingsRecord,
  ChecklistRecord,
  SpeciesRecord,
  ExpectedSpeciesRecord,
  ProjectRecord,
  ProjectSiteRecord,
  ProjectSurveyRecord,
  SessionOrTransectRecord,
  ObservationRecord,
} from '../types';

export type User = UserRecord;

export type Team = TeamRecord;

export type Settings = Omit<
  SettingsRecord,
  'userID' | 'projectID' | 'projectSurveyID'
> & {
  user: User;
  project: Project | null;
  projectSurvey: ProjectSurvey | null;
};

export type Checklist = ChecklistRecord;

export type Species = SpeciesRecord;

//TODO checklistmapping

// TODO figure out what to add here when we use this in the app
export type ExpectedSpecies = ExpectedSpeciesRecord;

export type Project = ProjectRecord;

export type ProjectSite = Omit<ProjectSiteRecord, 'projectID'> & {
  project: Project;
};

export type ProjectSurvey = Omit<ProjectSurveyRecord, 'projectID'> & {
  project: Project;
};

export type SessionOrTransect = Omit<SessionOrTransectRecord, 'siteID'> & {
  site: ProjectSite;
};

export type Observation = Omit<
  ObservationRecord,
  'projectSurveyID' | 'projectSiteID'
> & {
  projectSurvey: ProjectSurvey;
  projectSite: ProjectSite; // the site name
};

// we have the same methods on every service as we do on a db collection
interface BaseService<T> {
  get: (id: string) => Promise<T | undefined>; // get a record by ID
  all: () => Promise<T[]>; // get all records in the collection
  find: (query: Partial<T>) => Promise<T[]>; // find a record by query
  put: (record: T) => Promise<T>; // add or update a record
  delete: (id: string) => Promise<void>; // delete a record by ID
}

export interface UserService extends BaseService<User> {}
export interface TeamService extends BaseService<Team> {}
export interface SettingsService extends BaseService<Settings> {}
export interface ChecklistService extends BaseService<Checklist> {}
export interface SpeciesService extends BaseService<Species> {}
export interface ExpectedSpeciesService extends BaseService<ExpectedSpecies> {}
export interface ProjectService extends BaseService<Project> {}
export interface ProjectSiteService extends BaseService<ProjectSite> {}
export interface ProjectSurveyService extends BaseService<ProjectSurvey> {}
export interface SessionOrTransectService
  extends BaseService<SessionOrTransect> {}
export interface ObservationService extends BaseService<Observation> {}
