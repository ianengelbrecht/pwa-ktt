// note these have to kept in sync with schemas

//this is just temporary, used in the original testing
export interface CoordsRecord extends Record<string, any> {
  recordID: string; // unique ID for the record
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface dbCollection<T> {
  get: (id: string) => Promise<T | undefined>; // get a record by ID  
  put: (record: T) => Promise<void>; // add or update a record
  delete: (id: string) => Promise<void>; // delete a record by ID
  toArray: () => Promise<T[]>; // get all records in the collection
}

export type schemaField = {
  displayName: string; // the name of the field in the schema
}

export type schema = Record<string, schemaField> // the schema of the entity, with a displayName property for each field

type CoordinatesString = `${number}, ${number}`; // e.g. "12.34 56.78"

export type UserProfile = {
  userID: string | null;
  firstName: string | null;
  lastName: string | null;
  userInitials: string | null;
}

export type Settings = {
  settingsID: string | null; // unique ID for the settings
  user: UserProfile | null; // user profile of the logged in user
  project: Project | null; // project the user is currently working on
  projectSurvey: ProjectSurvey | null; // survey the user is currently busy with
  checklist: Checklist | null; // checklist the user is currently working with
}

export type Checklist = {
  checklistID: string | null;
  checklistName: string | null;
  createdBy: string | null; // userID of the creator
  createdDate: string | null; // date of creation
  notes: string | null; // notes about the checklist
}

// I think having checklists will solve this multiple names problem
// TODO sort out multiple names in different checklists
export type Species = {
  speciesID: string;
  checklistID: string;
  commonName1: string;
  commonName2: string;
  taxonName1: string;
  taxonName2: string;
  priority: boolean;
  scc: boolean;
  priorityRank: string;
  globalStatus: string;
  regionalStatus: string;
  notes: string;
  smallBird: boolean;
  largeBird: boolean;
  raptor: boolean;
  waterbird: boolean;
};



export type Project = {
  projectID: string | null;
  projectName: string | null;
  vpCount: number; // number of VPs in the project
  wtCount: number; // number of WTs in the project
  dtCount: number; // number of DTs in the project
  createdBy: string | null; // initials of the creator
  createdDate: string | null; // date of creation
} 

export type ProjectSite = {
  projectSiteID: string;
  projectID: string;
  siteCode: string;
  verbatimLocation: string | null; // the location as it was entered by the user
  siteLocation: CoordinatesString | null; // coordinates of the site
  thresholdDistance: number | null;
}

// The survey number / season for this project
export type ProjectSurvey = {
  surveyID: string | null;
  projectID: string | null;
  surveyName: string | null; // name of the survey (e.g. "Year 2 Season 4")
  startDate: string | null; // changed from number to string
  endDate: string | null; // changed from number to string
  season: string | null; // summer, autumn, etc
}

export type SiteVisit = {
  siteVisitID: string;
  siteID: string;
  date: string; 
  startTime: string; 
  endTime: string; 
}

export type Observation = {
  observationID: string | null;
  projectSurveyID: string | null;
  projectSite: string | null; // the site name
  location: CoordinatesString | null; // the coordinates
  locationAccuracy: number | null; // gps accuracy in meters
  date: string | null; // changed from number to string
  time: string | null; // changed from number to string
  observerInitials: string | null; // from the user profile
  species: Species | null;
  count: number | null;
  startDistance: number | null;
  startDirection: string | null;
  habitats: string[]; // changed from string to string[]
  notes: string | null;
  isFlight: boolean;
  flightNumber: string | null;
  flightStart: string | null; // changed from number to string
  flightEnd: string | null; // changed from number to string
  minHeight: number | null;
  maxHeight: number | null;
  averageHeight: number | null
  flightMode: string[];
  flightEndReason: string | null
}

export type ObservationSummary = {
  observationID: string | null; // unique ID for the observation
  speciesName: string | null; // name of the species
  location: CoordinatesString | null; // coordinates of the observation
  locationAccuracy: number | null; // gps accuracy in meters
  siteCode: string | null; // site code of the observation
  date: string | null; // date of the observation
  time: string | null; // time of the observation
  observerInitials: string | null; // initials of the observer
}
