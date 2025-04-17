import { db } from '../dbInterface';
import type { SettingsRecord } from '../types';
import type {
  User,
  Project,
  ProjectSurvey,
  Settings,
  SettingsService,
} from './types';

const { settings, users, projects, projectSurveys } = db;

async function getSettingsWithRelations(
  settingsRecord: SettingsRecord,
): Promise<Settings> {
  const { userID, projectID, projectSurveyID, ...rest } = settingsRecord;
  const user = await users.get(userID);
  const project = projectID ? await projects.get(projectID) : null;
  const projectSurvey = projectSurveyID
    ? await projectSurveys.get(projectSurveyID)
    : null;
  return {
    ...rest,
    user: user,
    project: project,
    projectSurvey: projectSurvey,
  } as Settings;
}

export const settingsService: SettingsService = {
  get: async (id) => {
    const result = await settings.get(id);
    if (!result) return undefined;
    const settingsWithRelations = await getSettingsWithRelations(result);
    return settingsWithRelations;
  },
  all: async () => {
    const results = await settings.all();
    const settingsWithRelations = await Promise.all(
      results.map(getSettingsWithRelations),
    );
    return settingsWithRelations;
  },
  find: async (partialSettings) => {
    delete partialSettings.user,
      delete partialSettings.project,
      delete partialSettings.projectSurvey;

    const results = await settings.find(partialSettings);
    const settingsWithRelations = await Promise.all(
      results.map(getSettingsWithRelations),
    );
    return settingsWithRelations;
  },
  put: async (settingsData: Settings): Promise<Settings> => {
    const { user, project, projectSurvey, ...rest } = settingsData;
    const settingsRecord: SettingsRecord = {
      ...(rest as Omit<
        SettingsRecord,
        'userID' | 'projectID' | 'projectSurveyID'
      >),
      userID: user.userID,
      projectID: project ? project.projectID : null,
      projectSurveyID: projectSurvey ? projectSurvey.surveyID : null,
    };
    return settings.put(settingsRecord).then(() => settingsData);
  },
  delete: settings.delete, // no reimplentation needed here
};
