<script lang="ts">
  import { speciesCollection } from "$lib/db/dexie";
  import BirdSpeciesForm from "../BirdSpeciesForm.svelte";
</script>

<BirdSpeciesForm saveRecord={speciesCollection.add} />