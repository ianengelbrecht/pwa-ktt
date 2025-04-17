// the implementation of the database
import type { Table } from 'dexie';
import * as dexie from './dexie';
import type {
  UserRecord,
  TeamRecord,
  SettingsRecord,
  ChecklistRecord,
  SpeciesRecord,
  ExpectedSpeciesRecord,
  ProjectRecord,
  ProjectSiteRecord,
  ProjectSurveyRecord,
  SessionOrTransectRecord,
  ObservationRecord,
  Collection,
  DB,
} from './types';

function makeCollection<T extends Record<string, any>>(
  table: Table<T>,
): Collection<T> {
  return {
    get: (id: string) => table.get(id),
    all: () => table.toArray(),
    find: async (query: Partial<T>) => {
      const indexes = table.schema.indexes.map((index) => index.name);
      const queryKeys = Object.keys(query);
      const dbQuery: Record<string, any> = {};
      const localFilter: Record<string, any> = {};
      for (const key of queryKeys) {
        if (indexes.includes(key)) {
          dbQuery[key] = query[key];
        } else {
          localFilter[key] = query[key];
        }
      }
      const dbResults = await table.where(dbQuery).toArray();
      const filteredResults = dbResults.filter((record) => {
        return Object.entries(localFilter).every(([key, value]) => {
          return record[key] === value;
        });
      });

      return filteredResults;
    },
    put: async (record: T) => {
      table.put(record);
      return record;
    },
    delete: (id: string) => table.delete(id),
  };
}

export const db: DB = {
  users: makeCollection<UserRecord>(dexie.userCollection),
  teams: makeCollection<TeamRecord>(dexie.teamCollection),
  settings: makeCollection<SettingsRecord>(dexie.settingsCollection),
  checklists: makeCollection<ChecklistRecord>(dexie.checklistCollection),
  species: makeCollection<SpeciesRecord>(dexie.speciesCollection),
  expectedSpecies: makeCollection<ExpectedSpeciesRecord>(
    dexie.expectedSpeciesCollection,
  ),
  projects: makeCollection<ProjectRecord>(dexie.projectCollection),
  projectSites: makeCollection<ProjectSiteRecord>(dexie.projectSiteCollection),
  projectSurveys: makeCollection<ProjectSurveyRecord>(
    dexie.projectSurveyCollection,
  ),
  sessionsOrTransects: makeCollection<SessionOrTransectRecord>(
    dexie.sessionsOrTransectsCollection,
  ),
  observations: makeCollection<ObservationRecord>(dexie.observationCollection),
};
