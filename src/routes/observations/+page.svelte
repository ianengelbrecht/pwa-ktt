<script lang="ts">
  import { error } from "@sveltejs/kit";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import SwipableList from "$lib/components/SwipableList.svelte";
  import ObservationCard from "./ObservationCard.svelte";
  import type {Project, ProjectSurvey, Observation } from "$lib/types/types";
  import { projectCollection, projectSurveyCollection, observationCollection } from "$lib/db/dexie.js";

  //TODO this needs the projectSurveyID
  const projectSurveyID = page.url.searchParams.get('projectSurveyID') || null;
  
  if (!projectSurveyID) {
    throw error(403, 'Oops, we should not have got here without a project survey ID!');
  }

  let project: Project | null = $state(null);
  let projectSurvey: ProjectSurvey | null = $state(null);
  const observations: Observation[] = $state([]);

  onMount(async () => {
    // load the project survey
    const projectSurveyFromDB = await projectSurveyCollection.get(projectSurveyID);
    if (!projectSurveyFromDB) {
      error(500, 'Woah! Something went seriously wrong, this project survey is not in the database!');
    }

    projectSurvey = projectSurveyFromDB;

    // load the project
    const projectFromDB = await projectCollection.get(projectSurvey!.projectID!);

    if (!projectFromDB) {
      error(500, 'Woah! Something went seriously wrong, this project is not in the database!');
    }

    project = projectFromDB;

    // get the observations for this project survey
    const observationsFromDB = await observationCollection.where('projectSurveyID').equals(projectSurveyID).toArray();
    
    observations.push(...observationsFromDB);
  });

  const deleteObservation = (observationRecord: Record<string, any>) => {
    observationCollection.where('observationID').equals(observationRecord.observationID).delete().then(() => {
      const index = observations.findIndex((record) => record === observationRecord as Observation);
      observations.splice(index, 1);
    });
  }

  const deleteAllObservations = () => {
    observationCollection.clear().then(() => {
      observations.length = 0;
    });
  }

</script>

<main class="flex flex-col gap-4 p-4">
  <h1 class="text-2xl font-bold">Observations</h1>
  <p>{project?.projectName || ''} {projectSurvey?.surveyName} || ''</p>
  <SwipableList
    items={observations}
    deleteItem={deleteObservation}
    deleteAll={deleteAllObservations}
    ItemComponent={ObservationCard}
  />
</main>