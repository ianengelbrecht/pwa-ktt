import { db } from '../dbInterface';
import type { ProjectService } from './types';

const { projects } = db;

export const projectService: ProjectService = {
  ...projects,
};
