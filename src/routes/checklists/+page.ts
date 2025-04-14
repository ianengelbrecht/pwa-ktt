import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Checklist } from '$lib/types/types';
import { checklistCollection } from '$lib/db/dexie';

export const load: PageLoad = async () => {
  let checklists: Checklist[] = [];
  try {
    checklists = await checklistCollection.toArray();
  } catch (e) {
    if (e instanceof Error) {
      error(500, 'Error fetching checklists: ' + e.message);
    } else {
      error(500, 'Error fetching checklists: ' + e);
    }
  }

  return { checklists };
};
