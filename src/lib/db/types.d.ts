// this is basically the database contract
// all objects are flat with IDs to referenced objects, for maximum cross compatibility

export interface dbCoordsRecord {
  recordID: string; // unique ID for the record
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface UserRecord {
  userID: string;
  firstName: string;
  lastName: string;
  userInitials: string;
  userEmail: string;
  memberOf: string[]; // list of teams the user is a member of
}

export interface TeamRecord {
  teamID: string;
  teamName: string;
  teamMembers: UserRecord[]; // list of users in the team
  notes: string | null; // notes about the team
  createdBy: string; // userID of the creator
  createdDate: string; // date of creation
}

export interface SettingsRecord {
  settingsID: string; // unique ID for the settings
  userID: string; // user profile of the logged in user
  projectID: string | null; // project the user is currently working on
  projectSurveyID: string | null; // survey the user is currently busy with
}

export interface ChecklistRecord {
  checklistID: string;
  checklistName: string;
  speciesCount: number;
  notes: string | null; // notes about the checklist
  global: boolean; // is this checklist globally available?
  availableTo: string[]; // list of teams this checklist is available to
  createdBy: string; // userID of the creator
  createdDate: string; // date of creation
}

// TODO resolve this, do we need the different common/taxonomic names?
export interface SpeciesRecord {
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
}

// Need to think about how best to do this.
// should species not be single entities, and
// included in different checklists?
// Then we can just update individual species.
// Might be tricky keeping everyone up to date.
// Another option is to have speciesConcepts,
// so have a species concept and it's name according to a checklist.
// But it can get very complicated with changing species concepts.
// let's experiment and see what works...
export interface ChecklistMappingRecord {}

// species expected for the project area
export interface ExpectedSpeciesRecord {
  projectID: string;
  checklistID: string;
  speciesID: string;
  probability: number; // SABAP FP value, e.g. 0.5
}

export interface ProjectRecord {
  projectID: string;
  projectName: string;
  vpCount: number; // number of VPs in the project
  wtCount: number; // number of WTs in the project
  dtCount: number; // number of DTs in the project
  checklistID: string | null; // the checklist used for this project
  expectedSpeciesProbabilitySource: string | null; // the source of the expected species probability, e.g. SABAP or eBird
  warningProbabilityThreshold: number | null; // the threshold below which a warning probability is given
  availableTo: string[]; // list of teams this project is available to
  createdBy: string; // ID of the creator
  createdDate: string; // date of creation
}

export interface ProjectSiteRecord {
  projectSiteID: string;
  projectID: string;
  siteCode: string;
  verbatimLocation: string; // the location as it was entered by the user
  decimalLatidude: number | null; // coordinates of the site
  decimalLongitude: number | null; // coordinates of the site
  thresholdDistance: number | null;
  sessionOrTransectDuration: number | null; // average time to complete a session or transect at this site
}

// The survey number / season for this project
export interface ProjectSurveyRecord {
  surveyID: string;
  projectID: string;
  surveyName: string; // name of the survey (e.g. "Year 2 Season 4")
  startDate: string; // changed from number to string
  endDate: string; // changed from number to string
  season: string; // summer, autumn, etc
}

// Stints at a VP or transect
export interface SessionOrTransectRecord {
  sessionOrTransectID: string;
  siteID: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ObservationRecord {
  observationID: string;
  projectSurveyID: string;
  projectSiteID: string; // the site name
  // leaving these fields as nullable for now in case there's a GPS malfunction
  verbatimCoordinates: string | null; // the coordinates as entered by the user
  decimalLatitude: number | null; // the latitude
  decimalLongitude: number | null; // the longitude
  coordinatesAccuracy: number | null; // gps accuracy in meters
  coordinatesSource: string | null; // the source of the coordinates, e.g. GPS, manual entry
  date: string; // changed from number to string
  time: string; // changed from number to string
  observerInitials: string; // from the user profile
  speciesID: string;
  count: number | null;
  startDistance: string | null; //can be categorical
  startDirection: string | null;
  habitats: string; // pipe separated string
  notes: string | null;
  isFlight: boolean;
  flightNumber: string | null;
  flightStart: string | null; // changed from number to string
  flightEnd: string | null; // changed from number to string
  minHeight: number | null;
  maxHeight: number | null;
  averageHeight: number | null;
  flightMode: string | null; // pipe separated string
  flightEndReason: string | null;
}

export interface Collection<T> {
  get: (id: string) => Promise<T | undefined>; // get a record by ID
  all: () => Promise<T[]>; // get all records in the collection
  find: (query: Partial<T>) => Promise<T[]>; // find a record by query
  put: (record: T) => Promise<T>; // add or update a record
  delete: (id: string) => Promise<void>; // delete a record by ID
}

export interface DB {
  users: Collection<UserRecord>;
  teams: Collection<TeamRecord>;
  settings: Collection<SettingsRecord>;
  checklists: Collection<ChecklistRecord>;
  species: Collection<SpeciesRecord>;
  expectedSpecies: Collection<ExpectedSpeciesRecord>;
  //checklistMappings: collection<ChecklistMappingRecord>;
  projects: Collection<ProjectRecord>;
  projectSurveys: Collection<ProjectSurveyRecord>;
  projectSites: Collection<ProjectSiteRecord>;
  sessionsOrTransects: Collection<SessionOrTransectRecord>;
  observations: Collection<ObservationRecord>;
}
