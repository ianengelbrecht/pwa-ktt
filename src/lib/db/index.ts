import * as dbAdapter from './dbAdapter';

export const db = {
  users: dbAdapter.userService,
  teams: dbAdapter.teamService,
  settings: dbAdapter.settingsService,
  checklists: dbAdapter.checklistService,
  species: dbAdapter.speciesService,
  expectedSpecies: dbAdapter.expectedSpeciesService,
  projects: dbAdapter.projectService,
  projectSurveys: dbAdapter.projectSurveyService,
  projectSites: dbAdapter.projectSiteService,
  sessionsOrTransects: dbAdapter.sessionOrTransectService,
  observations: dbAdapter.observationService,
};
