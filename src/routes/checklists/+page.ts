import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Checklist } from '$lib/types/types';
import { checklistCollection } from "$lib/db/dexie";

export const load: PageLoad = async () => {

  const checklists: Checklist[] = $state([])
  try {
    const checklistsArray = await checklistCollection.toArray()
    checklists.push(...checklistsArray)
  }
  catch (e) {
    if (e instanceof Error) {
      error(500, 'Error fetching checklists: ' + e.message);
    }
    else {
      error(500, 'Error fetching checklists: ' + e);
    }
  }

	return { checklists };

};


