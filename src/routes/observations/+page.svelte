<script lang="ts">
  import { onMount } from "svelte";
  import SwipableList from "$lib/components/SwipableList.svelte";
  import ObservationCard from "./ObservationCard.svelte";
  import type { Observation } from "$lib/types/types";
  import { observationCollection } from "$lib/db/dexie.js";

  const observations: Observation[] = $state([]);

  onMount(() => {
    observationCollection.toArray().then((observationRecords) => {
      observationRecords.forEach((observationRecord) => {
        observations.push(observationRecord);
      });
    });
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
  <SwipableList
    items={observations}
    deleteItem={deleteObservation}
    deleteAll={deleteAllObservations}
    itemIDfield="observationID"
    ItemComponent={ObservationCard}
  />
</main>