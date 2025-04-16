import { db } from '../db/db';
import type { SpeciesService } from './types';

const { species } = db;

export const speciesService: SpeciesService = {
  ...species,
};
