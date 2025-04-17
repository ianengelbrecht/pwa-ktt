import { db } from '../dbInterface';
import type {
  ObservationRecord,
  ProjectSiteRecord,
  ProjectSurveyRecord,
} from '../types';
import type {
  Observation,
  ObservationService,
  ProjectSurvey,
  ProjectSite,
} from './types';

const { observations, projectSurveys, projectSites, projects } = db;

async function getObservationWithRelations(
  observationRecord: ObservationRecord,
) {
  const { projectSurveyID, projectSiteID, ...rest } = observationRecord;
  const projectSurvey = await db.projectSurveys.get(projectSurveyID);
  const projectSite = await db.projectSites.get(projectSiteID);
  if (!projectSurvey || !projectSite) {
    throw new Error('Project survey or project site not found');
  }
  const project = await db.projects.get(projectSurvey.projectID);
  if (!project) {
    throw new Error('Project not found');
  }

  const { projectID, ...restProjectSurvey } = projectSurvey;
  const projectSurveyWithRelations = {
    ...(restProjectSurvey as Omit<ProjectSurveyRecord, 'projectID'>),
    project: project,
  } as ProjectSurvey;

  //same for project site
  const { projectID: siteProjectID, ...restProjectSite } = projectSite; //just renaming to avoid the conflict
  const projectSiteWithRelations = {
    ...(restProjectSite as Omit<ProjectSiteRecord, 'projectID'>),
    project: project,
  } as ProjectSite;

  return {
    ...rest,
    projectSurvey: projectSurveyWithRelations,
    projectSite: projectSiteWithRelations,
  } as Observation;
}

export const observationService: ObservationService = {
  get: async (id) => {
    const result = await observations.get(id);
    if (!result) return undefined;
    const observationWithRelations = await getObservationWithRelations(result);
    return observationWithRelations;
  },
  all: async () => {
    const results = await observations.all();
    const observationsWithRelations = await Promise.all(
      results.map(getObservationWithRelations),
    );
    return observationsWithRelations;
  },
  find: async (partialObservation) => {
    delete partialObservation.projectSurvey; //remove the project survey from the query
    delete partialObservation.projectSite; //remove the project site from the query
    const results = await observations.find(partialObservation);
    const observationsWithRelations = await Promise.all(
      results.map(getObservationWithRelations),
    );
    return observationsWithRelations;
  },
  put: (observationData) => {
    const { projectSurvey, projectSite, ...rest } = observationData;
    const observationRecord: ObservationRecord = {
      projectSurveyID: projectSurvey.surveyID,
      projectSiteID: projectSite.projectSiteID,
      ...(rest as Omit<ObservationRecord, 'projectSurveyID' | 'projectSiteID'>),
    };
    return observations.put(observationRecord).then(() => observationData);
  },
  delete: observations.delete,
};
