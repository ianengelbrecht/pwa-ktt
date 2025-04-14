import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Project, ProjectSurvey } from '$lib/types/types';
import { projectCollection, projectSurveyCollection} from "$lib/db/dexie";

export const load: PageLoad = async ({ url }) => {

  const projectID = url.searchParams.get('projectID') || null;
  let project: Project | null = null;
  let projectSurveys: ProjectSurvey[] = [];
    
  if (!projectID) {
    error(400, {
      message: 'Oops, you got here with no projectID! That should not have happened...'
    })
  }

  project = await projectCollection.get(projectID!) || null
  if (!project) {
    error(500, 'Whoah! There is no project with ID ' + projectID + ' in the database. Something is wrong!');
  }

  projectSurveys = await projectSurveyCollection
    .where('projectID')
    .equals(projectID)
    .sortBy('siteCode')
    
  return { project, projectSurveys };

}