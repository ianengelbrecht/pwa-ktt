import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Species, Checklist } from '$lib/types/types';
import { checklistCollection, speciesCollection } from "$lib/db/dexie";

export const load: PageLoad = async ({ url, params }) => {

  let species: Species | null = null
  let checklist: Checklist | null = null;

  let speciesID = params.speciesID || null;
  let checklistID = url.searchParams.get('checklistID') || null;
  
  //we should only be able to get here from a checklist page/card
  if (!speciesID) {
    //redirect to  error page
    error(400, 'Oops, we should not have got here without a speciesID...');
  }

  //we should only be able to get here from a checklist page/card
  if (!checklistID) {
    //redirect to  error page
    error(400, 'Oops, we should not have got here without a checklistID...');
  }

  if (speciesID != 'new') {
    //fetch the species from the database
    try {
      species = await speciesCollection.get(speciesID) || null
    }
    catch (e) {
      if (e instanceof Error) {
        error(500, 'Error getting species from database:' + e.message);
      }
      else {
        error(500, 'Error getting species from database:' + e);
      }
    }
  }

  // fetch the checklist from the database
  try {
    checklist = await checklistCollection.get(checklistID) || null
    if (!checklist) {
      //redirect to error page
      error(500, `Whoah! The checklist for this species does not exist in the database!`);
    }
  }
  catch (e) {
    if (e instanceof Error) {
      error(500, 'Error getting checklist from database:' + e.message);
    }
    else {
      error(500, 'Error getting checklist from database:' + e);
    }
  }

  return { species, checklist };
  
}