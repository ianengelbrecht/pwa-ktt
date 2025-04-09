<script lang="ts">
  import { observationCollection } from "$lib/db/dexie";
  import ObservationForm from "../ObservationForm.svelte";
</script>

<ObservationForm saveRecord={observationCollection.add} />