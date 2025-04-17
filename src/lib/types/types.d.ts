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
} from '../db/types';

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

/// NOTE THESE ARE THE OLD TYPES, THEY WILL NEED TO BE MOVED TO THE RELEVANT PLACES AS WE GO

export type schemaField = {
  displayName: string; // the name of the field in the schema
};

export type schema = Record<string, schemaField>; // the schema of the entity, with a displayName property for each field

type CoordinatesString = `${number}, ${number}`; // e.g. "12.34 56.78"

export type ConvertedCoordinatesWithAccuracy = ReturnType<typeof convert> & {
  accuracy: number | null;
  source: 'manual' | 'device';
};

export interface MapComponentProps {
  startingPoint?: CoordinatesString | null;
  startingZoom?: number;
  handleNewMapCoordinates: (mapCoordsResults: MapCoordinates) => void;
}

export interface MapCoordinates {
  coords: CoordinatesString;
  mapType: string;
}

// note these have to kept in sync with schemas

//this is just temporary, used in the original testing
export interface CoordsRecord extends Record<string, any> {
  recordID: string; // unique ID for the record
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface CoordsContainerOptions {
  labelString?: string;
  coordinatesString: string | null;
  maximumAllowedAccuracy?: number;
  handleSuccessfulCoordinates: (
    coordinatesObject: ConvertedCoordinatesWithAccuracy,
  ) => void;
  handleMapButtonClick: (ev: Event) => void;
}

// not in db yet, only in settings

// checklist management to come, do we want them and their mappings to be
// globally available?

// I think having checklists will solve this multiple names problem
// TODO sort out multiple names in different checklists

export type ObservationSummary = {
  observationID: string | null; // unique ID for the observation
  speciesName: string | null; // name of the species
  location: CoordinatesString | null; // coordinates of the observation
  locationAccuracy: number | null; // gps accuracy in meters
  siteCode: string | null; // site code of the observation
  date: string | null; // date of the observation
  time: string | null; // time of the observation
  observerInitials: string | null; // initials of the observer
};
