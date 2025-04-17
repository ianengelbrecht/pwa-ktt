import {
  Checklist,
  ExpectedSpecies,
  Observation,
  Project,
  ProjectSite,
  ProjectSurvey,
  SessionOrTransect,
  Settings,
  Species,
  Team,
  User,
} from '../../types/types';

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
