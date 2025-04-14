import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Project, ProjectSurvey } from '$lib/types/types';
import { projectCollection, projectSurveyCollection} from "$lib/db/dexie";

export const load: PageLoad = async ({ url, params }) => {

  const projectID = url.searchParams.get('projectID') || null;
  const projectSurveyID = params.projectSurveyID || null;
  
  let project: Project | null = null;
  let projectSurvey: ProjectSurvey | null = null;

  if (!projectSurveyID) {
    error(400, {
      message: 'Oops, you got here with no projectSurveyID! That should not have happened...'
    })
  }
    
  if (!projectID) {
    error(400, {
      message: 'Oops, you got here with no projectID! That should not have happened...'
    })
  }

  try {
    project = await projectCollection.get(projectID!) || null
  }
  catch (e) {
    if (e instanceof Error) {
      error(500, 'Error retrieving project: ' + e.message);
    }
    else {
      error(500, 'Error retrieving project: ' + e);
    }
  }

  if (!project) {
    error(500, 'Whoah! There is no project with ID ' + projectID + ' in the database. Something is wrong!');
  }

  if (projectSurveyID != 'new') {
    try {
      projectSurvey = await projectSurveyCollection.get(projectSurveyID!) || null
    }
    catch (e) {
      if (e instanceof Error) {
        error(500, 'Error retrieving projectSurvey: ' + e.message);
      }
      else {
        error(500, 'Error retrieving projectSurvey : ' + e);
      }
    }
  
    if (!project) {
      error(500, 'Whoah! There is no project with ID ' + projectID + ' in the database. Something is wrong!');
    }
  }
    
  return { project, projectSurvey, projectID };

}