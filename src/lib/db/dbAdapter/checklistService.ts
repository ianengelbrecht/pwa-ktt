import { db } from '../dbInterface';
import type { ChecklistService } from './types';

const { checklists } = db;

export const checklistService: ChecklistService = {
  ...checklists,
};
