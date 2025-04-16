import { db } from '../db/db';
import type { ChecklistService } from './types';

const { checklists } = db;

export const checklistService: ChecklistService = {
  ...checklists,
};
