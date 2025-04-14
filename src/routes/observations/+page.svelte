<script lang="ts">
  import BackButton from '$lib/components/BackButton.svelte';
  import SwipableList from '$lib/components/SwipableList.svelte';
  import ObservationCard from './ObservationCard.svelte';
  import type { ObservationSummary } from '$lib/types/types';
  import { observationCollection } from '$lib/db/dexie.js';

  const { data } = $props();
  const { settings, summarizedObservations } = data;

  const deleteObservation = (observationRecord: Record<string, any>) => {
    observationCollection.delete(observationRecord.observationID).then(() => {
      const index = summarizedObservations.findIndex(
        (record) => record === (observationRecord as ObservationSummary),
      );
      summarizedObservations.splice(index, 1);
    });
  };

  // TODO do we really want to allow this?
  const deleteAllObservations = () => {
    observationCollection.clear().then(() => {
      summarizedObservations.length = 0;
    });
  };
</script>

<main class="flex flex-col gap-4 p-4">
  <BackButton />
  <div>
    <h1 class="text-2xl font-bold">Observations</h1>
    <p>
      {settings.project?.projectName || ''}
      {settings.projectSurvey?.surveyName || ''}
    </p>
  </div>
  <SwipableList
    items={summarizedObservations}
    deleteItem={deleteObservation}
    deleteAll={deleteAllObservations}
    ItemComponent={ObservationCard}
  />
</main>
