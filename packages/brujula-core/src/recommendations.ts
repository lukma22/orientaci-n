import { MATCH_DB } from './demo-catalog';
import type { CareerRepository } from './types';

/** Replace this adapter with an API adapter when a validated catalogue exists. */
export const demoCareerRepository: CareerRepository = {
  async findByProfile(profile) {
    // The original fallback used "IC" although its key is "CI". Never invent a match.
    return MATCH_DB[profile.catalogKey] ?? null;
  },
};
