import { db } from '../dbInterface';
import type { ExpectedSpeciesService } from './types';

const { expectedSpecies } = db;

export const expectedSpeciesService: ExpectedSpeciesService = {
  ...expectedSpecies,
};
