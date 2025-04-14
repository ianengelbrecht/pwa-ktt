import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Project } from '$lib/types/types';
import { projectCollection } from '$lib/db/dexie';

export const load: PageLoad = async ({ params }) => {
  let projects: Project[] = [];

  try {
    projects = await projectCollection.toArray();
  } catch (e) {
    if (e instanceof Error) {
      error(500, 'Error retrieving projects:' + e.message);
    } else {
      error(500, 'Error retrieving projects:' + e);
    }
  }

  return { projects };
};
