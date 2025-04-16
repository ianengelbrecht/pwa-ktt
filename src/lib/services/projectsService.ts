import { db } from '../db/db';
import type { ProjectService } from './types';

const { projects } = db;

export const projectsService: ProjectService = {
  ...projects,
};
