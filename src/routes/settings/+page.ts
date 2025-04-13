import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Settings, Project, ProjectSurvey, Checklist} from '$lib/types/types';
import { settingsCollection, projectCollection, projectSurveyCollection, checklistCollection } from "$lib/db/dexie";

export const load: PageLoad = async () => {

  let settings: Settings | null = null
  let projects: Project[] = []
  let projectSurveys: ProjectSurvey[] = []
  let checklists: Checklist[] = []

  // load settings
  try {
    const settingsArray = await settingsCollection.toArray()
    if (settingsArray.length > 0) {
      settings = settingsArray[0];
    }
  }
  catch (e) {
    if (e instanceof Error) {
      error(500, 'Error fetching settings: ' + e.message);
    }
    else {
      error(500, 'Error fetching settings: ' + e);
    }
  }

  // load the projects
  try {
    projects = await projectCollection.toArray()
  }
  catch (e) {
    if (e instanceof Error) {
      error(500, 'Error fetching projects: ' + e.message);
    }
    else {
      error(500, 'Error fetching projects: ' + e);
    }
  }

  // load the checklists
  //TODO only load checklists which have species
  try {
    checklists = await checklistCollection.toArray()
    checklists = checklists.filter((c) => c.speciesCount); // only keep checklists with species
  }
  catch (e) {
    if (e instanceof Error) {
      error(500, 'Error fetching checklists: ' + e.message);
    }
    else {
      error(500, 'Error fetching checklists: ' + e);
    }
  }

  // reconcile nested objects loaded from the database
  if (settings && settings.project) {
    
    const dbProject = projects.find((p) => p.projectID === settings.project!.projectID);
    if (dbProject) { // it should always be true unless one deletes the project
      settings.project = dbProject;
    }
    else {
      alert('The project you previously selected is missing from the database!');
      settings.project = null; // reset the project in settings	
    }
  
    // load the project surveys
    if (settings.project) {
      
      try {
        projectSurveys = await projectSurveyCollection.where('projectID').equals(settings.project!.projectID!).toArray()
      }
      catch (e) {
        if (e instanceof Error) {
          error(500, 'Error fetching project surveys: ' + e.message);
        }
        else {
          error(500, 'Error fetching project surveys: ' + e);
        }
      }

      if (settings.projectSurvey) {
        const dbProjectSurvey = projectSurveys.find((ps) => ps.surveyID === settings.projectSurvey!.surveyID);
        if (dbProjectSurvey) { // it should always be true unless it was deleted
          settings.projectSurvey = dbProjectSurvey;
        }
        else {
          alert('The project survey you previously selected is missing from the database!');
          settings.projectSurvey = null; // reset the project survey in settings	
        }
      }
    }
  }

  // match up the checklists
  if (settings && settings.checklist) {
    const dbChecklist = checklists.find((c) => c.checklistID === settings.checklist!.checklistID);
    if (dbChecklist) { // it might have been deleted
      settings.checklist = dbChecklist;
    }
    else {
      alert('The checklist you previously selected is missing from the database or doesn\'t have a species count!');
      settings.checklist = null; // reset the checklist in settings	
    }
  }

  return { settings, projects, projectSurveys, checklists  };

}
