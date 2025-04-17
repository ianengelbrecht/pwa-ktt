import { db } from '../dbInterface';
import type { ProjectSurveyRecord } from '../types';
import type { ProjectSurvey, ProjectSurveyService } from './types';

const { projectSurveys } = db;

async function getProjectSurveyWithRelations(
  projectSurveyRecord: ProjectSurveyRecord,
) {
  const { projectID, ...rest } = projectSurveyRecord;
  const project = projectID ? await db.projects.get(projectID) : null;
  return {
    ...rest,
    project: project,
  } as ProjectSurvey;
}

export const projectSurveyService: ProjectSurveyService = {
  get: async (id) => {
    const result = await projectSurveys.get(id);
    if (!result) return undefined;
    const projectSurveyWithRelations =
      await getProjectSurveyWithRelations(result);
    return projectSurveyWithRelations;
  },
  all: async () => {
    const results = await projectSurveys.all();
    const projectSurveysWithRelations = await Promise.all(
      results.map(getProjectSurveyWithRelations),
    );
    return projectSurveysWithRelations;
  },
  find: async (partialProjectSurvey) => {
    delete partialProjectSurvey.project;
    const results = await projectSurveys.find(partialProjectSurvey);
    const projectSurveysWithRelations = await Promise.all(
      results.map(getProjectSurveyWithRelations),
    );
    return projectSurveysWithRelations;
  },
  put: (projectSurveyData) => {
    const { project, ...rest } = projectSurveyData;
    const projectSurveyRecord: ProjectSurveyRecord = {
      projectID: project.projectID,
      ...(rest as Omit<ProjectSurveyRecord, 'projectID'>),
    };
    return projectSurveys
      .put(projectSurveyRecord)
      .then(() => projectSurveyData);
  },
  delete: projectSurveys.delete,
};
