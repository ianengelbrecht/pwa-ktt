import { db } from '../dbInterface';
import type { TeamService } from './types';

const { teams } = db;

export const teamService: TeamService = {
  ...teams,
};
