import { db } from '../dbInterface';
import type { SpeciesService } from './types';

const { species } = db;

export const speciesService: SpeciesService = {
  ...species,
};
