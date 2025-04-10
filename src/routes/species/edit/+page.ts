import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { speciesCollection } from "$lib/db/dexie";

export const load: PageLoad = async ({ url }) => {
  const speciesID = url.searchParams.get('speciesID') || null;
  if (!speciesID) {
    //redirect to error page
    error(403, 'Species ID is required');
  }

  const speciesRecord = await speciesCollection.get(speciesID);

	return speciesRecord;
};