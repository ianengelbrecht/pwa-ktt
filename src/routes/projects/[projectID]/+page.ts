import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Project, Settings, UserProfile } from '$lib/types/types';
import { projectCollection, settingsCollection } from '$lib/db/dexie';

export const load: PageLoad = async ({ params }) => {
  const projectID = params.projectID || null;
  let project: Project | null = null;
  let settings: Settings | null = null;
  let userProfile: UserProfile | null = null;

  if (!projectID) {
    error(400, {
      message:
        'Oops, you got here with no projectID! That should not have happened...',
    });
  }

  if (projectID != 'new ') {
    project = (await projectCollection.get(projectID!)) || null;
    if (!project) {
      error(
        500,
        'Whoah! There is no project with ID ' +
          projectID +
          ' in the database. Something is wrong!',
      );
    }
  }

  try {
    const settingsArray = await settingsCollection.toArray();
    settings = settingsArray[0];
  } catch (e) {
    if (e instanceof Error) {
      error(500, 'Error retrieving settings:' + e.message);
    } else {
      error(500, 'Error retrieving settings:' + e);
    }
  }

  if (!settings || !settings.user) {
    error(
      400,
      'We need user details in settings before we can add projects...',
    );
  }

  userProfile = settings.user;

  return { project, user: userProfile };
};
