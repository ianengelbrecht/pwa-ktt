// note these have to be kept in sync with types
import type { schema } from "$lib/types/types";

export const checklistSchema: schema = {
  checklistID: { displayName: "Checklist ID" }, // won't be visible
  checklistName: { displayName: "Checklist Name" },
}

export const speciesSchema: schema = {
  checklistID: { displayName: "Checklist ID" }, // won't be visible
  speciesID: { displayName: "Species ID" }, // won't be visible
  commonName1: { displayName: "Common Name (Birdlife SA 2024)" },
  commonName2: { displayName: "Afrikaans Name (Birdlife SA 2024)" },
  taxonName1: { displayName: "Taxonomic Name (Birdlasser)" },
  taxonName2: { displayName: "Taxonomic Name (Birdlife SA 2024)" },
  priorty: { displayName: "WEF Priority" },
  scc: { displayName: "SCC" },
  priorityRank: { displayName: "WEF Priority Species Rank" },
  globalStatus: { displayName: "Global Status (IUCN, 2024)" },
  regionalStatus: { displayName: "Regional Status (Taylor et  al. 2015)" },
  notes: { displayName: "Notes" },
  smallBird: { displayName: "Small Bird (<30cm)" },
  largeBird: { displayName: "Large Bird (>30cm)" },
  raptor: { displayName: "Raptor" },
  waterbird: { displayName: "Waterbird (Associated)" },
};

export const userProfileSchema: schema = {
  userID: { displayName: "" }, // the auth ID, won't be visible
  firstName: { displayName: "First Name" },
  lastName: { displayName: "Last Name" },
  userInitials: { displayName: "User Initials" },
}

export const projectSchema: schema = {
  projectID: { displayName: "Project ID" }, // won't be visible
  projectName: { displayName: "Project Name" }
}

// for a project, there are multiple surveys/visits
export const projectSurveySchema: schema = {
  surveyID: { displayName: "Survey ID" }, // won't be visible
  projectID: { displayName: "Project ID" }, // won't be visible
  startDate: { displayName: "Start Date" },
  endDate: { displayName: "End Date" },
  season: { displayName: "Season" },
}

// project sites are the VPs, WT, DTs, etc
export const projectSiteSchema: schema = {
  projectID: { displayName: "Project ID" }, // won't be visible
  siteID: { displayName: "Site ID" }, // won't be visible
  siteCode: { displayName: "Site Code" },
  siteLatitude: { displayName: "Latitude" },
  siteLongitude: { displayName: "Longitude" },
  thresholdDistance: { displayName: "Threshold Distance (km)" },
}

// the visit to each project site, not a lot of good terms for this
export const siteVisitSchema: schema = {
  siteVisitID: { displayName: "Site Visit ID" }, // won't be visible
  siteID: { displayName: "Site ID" }, // won't be visible
  date: { displayName: "Date" },
  startTime: { displayName: "Start Time" },
  endTime: { displayName: "End Time" },
}

export const observationSchema: schema = {
  recordID: { displayName: "" }, // won't be visible
  projectSurvey: { displayName: "" }, // won't be visible
  projectSite: { displayName: "Site" }, 
  date: { displayName: "Date" },
  time: { displayName: "Time" },  
  observerInitials: { displayName: "Observer" }, //need to check if this ever another person?
  species: { displayName: "Species" },
  count: { displayName: "Number of individuals" },
  startDistance: { displayName: "Distance from observer (start)" },
  endDistance: { displayName: "Distance from observer (end)" },
  habitats: { displayName: "Habitats utilized" },
  notes: { displayName: "Additional Comments" },
  location: { displayName: "Location" },
  isFlight: { displayName: "Flight?" },
  flightNumber: { displayName: "Flight Number" },
  flightStart: { displayName: "Flight Start Time" },
  flightEnd: { displayName: "Flight End Time" },
}