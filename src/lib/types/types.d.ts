// note these have to kept in sync with schemas


//this is just temporary, used in the original testing
export type record = {
  timestamp: number, 
  latitude: number, 
  longitude: number, 
  accuracy: number
}

export type Checklist = {
  checklistID: string;
  checklistName: string;
}

export type Species = {
  checklistID: string;
  speciesID: string;
  commonName1: string;
  commonName2: string;
  taxonName1: string;
  taxonName2: string;
  priorty: string;
  scc: string;
  priorityRank: string;
  globalStatus: string;
  regionalStatus: string;
  speciesNotes: string;
  smallBird: number;
  largeBird: number;
  raptor: number;
  waterbird: number;
};

export type UserProfile = {
  userID: string;
  firstName: string;
  lastName: string;
  userInitials: string;
}

export type Project = {
  projectID: string;
  projectName: string;
} 

export type ProjectSurvey = {
  surveyID: string;
  projectID: string;
  startDate: string; // changed from number to string
  endDate: string; // changed from number to string
  season: string;
}

export type ProjectSite = {
  projectID: string;
  siteID: string;
  siteCode: string;
  siteLatitude: number;
  siteLongitude: number;
  thresholdDistance: number;
}

export type SiteVisit = {
  siteVisitID: string;
  siteID: string;
  date: string; 
  startTime: string; 
  endTime: string; 
}

export type Observation = {
  recordID: string;
  projectSurvey: ProjectSurvey;
  projectSite: ProjectSite;
  date: string; // changed from number to string
  time: string; // changed from number to string
  observerInitials: string; // from the user profile
  species: Species;
  count: number;
  startDistance: number;
  endDistance: number;
  habitats: string[]; // changed from string to string[]
  notes: string;
  location: string;
  isFlight: boolean;
  flightNumber: string;
  flightStart: string; // changed from number to string
  flightEnd: string; // changed from number to string
}
