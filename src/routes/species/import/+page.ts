import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Checklist } from '$lib/types/types';
import { checklistCollection } from '$lib/db/dexie';

export const load: PageLoad = async ({ url }) => {
  let checklist: Checklist | null = null;

  let checklistID = url.searchParams.get('checklistID') || null;

  //we should only be able to get here from a checklist page/card
  if (!checklistID) {
    //redirect to  error page
    error(
      400,
      'Oops, we should not have got here without a checklistID for the species list',
    );
  }

  // fetch the checklist from the database
  try {
    checklist = (await checklistCollection.get(checklistID!)) || null;
    if (!checklist) {
      //redirect to error page
      error(
        500,
        `Whoah! The checklist with ID ${checklistID} does not exist in the database!`,
      );
    }
  } catch (e) {
    if (e instanceof Error) {
      error(500, 'Error getting checklist from database:' + e.message);
    } else {
      error(500, 'Error getting checklist from database:' + e);
    }
  }

  return { checklist };
};
