import { db } from '../db/db';
import type { TeamService } from './types';

const { teams } = db;

export const teamsService: TeamService = {
  ...teams,
};
