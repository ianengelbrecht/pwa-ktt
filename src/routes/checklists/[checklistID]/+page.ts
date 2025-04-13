import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Settings, Checklist } from '$lib/types/types';
import {settingsCollection, checklistCollection } from "$lib/db/dexie";

export const load: PageLoad = async ( { params } ) => {

  let settings: Settings | null = null;
  let checklist: Checklist | null = null;
  const checklistID = params.checklistID;

  if (!checklistID) {
    error(400, "Oops! We should not have got here without a checklist ID...");
  }

  try {
    const settingsArray = await settingsCollection.toArray()
    if (settingsArray.length > 0) {
      settings = settingsArray[0];
    } else {
      error(400, 'Oops! We need settings with details first...');
    }
  }
  catch (err) {
    if (err instanceof Error) {
      error(500, "Error fetching settings: " + err.message);
    } else {
      error(500, "Error fetching settings: " + err);
    }
  }

  if (!settings.user || !settings.user.userInitials) {
    error(400, 'Oops! The user is missing initials in settings...');
  }

  
  // load the checklist
  if (checklistID != 'new') {
    try {
      checklist = await checklistCollection.get(checklistID) || null;
      if (!checklist) {
        error(500, 'Whoah! The checklist you previously selected is missing from the database!');
      }
    }
    catch (err) {
      if (err instanceof Error) {
        error(500, "Error fetching checklist: " + err.message);
      } else {
        error(500, "Error fetching checklist: " + err);
      }
    }
  }

  return { user: settings.user, checklist}

};


