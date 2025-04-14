<script lang="ts">
  import { toast } from '@zerodevx/svelte-toast';
  import BackButton from '$lib/components/BackButton.svelte';
  import SwipableList from '$lib/components/SwipableList.svelte';
  import ObservationCard from './ObservationCard.svelte';
  import type { ObservationSummary } from '$lib/types/types';
  import { observationCollection } from '$lib/db/dexie.js';

  const { data } = $props();
  const { settings, summarizedObservations } = data;

  const deleteObservation = async (observationRecord: Record<string, any>) => {
    try {
      await observationCollection.delete(observationRecord.observationID);
    } catch (err) {
      if (err instanceof Error) {
        alert('Error deleting record: ' + err.message);
      } else {
        alert('Error deleting record: ' + err);
      }
      return;
    }
    const index = summarizedObservations.findIndex(
      (record) => record.observationID === observationRecord.observationID,
    );
    if (index !== -1) {
      summarizedObservations.splice(index, 1);
      toast.push(`Record deleted`, {
        theme: { '--toastBackground': 'oklch(26.6% 0.079 36.259)' },
      });
    }
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
