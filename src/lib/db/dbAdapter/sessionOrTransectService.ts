import { db } from '../dbInterface';
import type { SessionOrTransectRecord } from '../types';
import type { SessionOrTransectService } from './types';
import type { SessionOrTransect } from '../../types/types';

const { sessionsOrTransects, projects } = db;

async function getSessionOrTransectWithRelations(
  sessionOrTransectRecord: SessionOrTransectRecord,
) {
  const { siteID, ...rest } = sessionOrTransectRecord;
  const site = await db.projectSites.get(siteID);
  if (!site) {
    throw new Error(`Site with ID ${siteID} not found`);
  }
  const project = await db.projects.get(site.projectID);
  if (!project) {
    throw new Error(`Project with ID ${site.projectID} not found`);
  }
  const siteWithRelations = {
    ...site,
    project: project,
  };
  return {
    ...rest,
    site: siteWithRelations,
  } as SessionOrTransect;
}

export const sessionOrTransectService: SessionOrTransectService = {
  get: async (id) => {
    const result = await sessionsOrTransects.get(id);
    if (!result) return undefined;
    const sessionOrTransectWithRelations =
      await getSessionOrTransectWithRelations(result);
    return sessionOrTransectWithRelations;
  },
  all: async () => {
    const results = await sessionsOrTransects.all();
    const sessionsOrTransectsWithRelations = await Promise.all(
      results.map(getSessionOrTransectWithRelations),
    );
    return sessionsOrTransectsWithRelations;
  },
  find: async (partialSessionOrTransect) => {
    delete partialSessionOrTransect.site;
    const results = await sessionsOrTransects.find(partialSessionOrTransect);
    const sessionsOrTransectsWithRelations = await Promise.all(
      results.map(getSessionOrTransectWithRelations),
    );
    return sessionsOrTransectsWithRelations;
  },
  put: (sessionOrTransectData) => {
    const { site, ...rest } = sessionOrTransectData;
    const sessionOrTransectRecord: SessionOrTransectRecord = {
      siteID: site.projectSiteID,
      ...(rest as Omit<SessionOrTransectRecord, 'siteID'>),
    };
    return sessionsOrTransects
      .put(sessionOrTransectRecord)
      .then(() => sessionOrTransectData);
  },
  delete: sessionsOrTransects.delete,
};
