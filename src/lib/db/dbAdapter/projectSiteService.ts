import { db } from '../dbInterface';
import type { ProjectSiteRecord } from '../types';
import type { ProjectSite, ProjectSiteService } from './types';

const { projectSites } = db;

async function getProjectSiteWithRelations(
  projectSiteRecord: ProjectSiteRecord,
) {
  const { projectID, ...rest } = projectSiteRecord;
  const project = projectID ? await db.projects.get(projectID) : null;
  return {
    ...rest,
    project: project,
  } as ProjectSite;
}

export const projectSiteService: ProjectSiteService = {
  get: async (id) => {
    const result = await projectSites.get(id);
    if (!result) return undefined;
    const projectSiteWithRelations = await getProjectSiteWithRelations(result);
    return projectSiteWithRelations;
  },
  all: async () => {
    const results = await projectSites.all();
    const projectSitesWithRelations = await Promise.all(
      results.map(getProjectSiteWithRelations),
    );
    return projectSitesWithRelations;
  },
  find: async (partialProjectSite) => {
    delete partialProjectSite.project;
    const results = await projectSites.find(partialProjectSite);
    const projectSitesWithRelations = await Promise.all(
      results.map(getProjectSiteWithRelations),
    );
    return projectSitesWithRelations;
  },
  put: (projectSiteData) => {
    const { project, ...rest } = projectSiteData;
    const projectSiteRecord: ProjectSiteRecord = {
      projectID: project.projectID,
      ...(rest as Omit<ProjectSiteRecord, 'projectID'>),
    };
    return projectSites.put(projectSiteRecord).then(() => projectSiteData);
  },
  delete: projectSites.delete,
};
