<script lang="ts">
  import type { Species } from "$lib/types/types";
  import { speciesCollection } from "$lib/db/dexie";
  import BirdSpeciesForm from "../BirdSpeciesForm.svelte";

  const { data: speciesRecord }: {data: Species} = $props()

  const handleSaveClick = async (ev: Event) => {
    ev.preventDefault();

    try {
      await speciesCollection.put($state.snapshot(speciesRecord));
      window.history.back()
    }

    catch(err) {
      if (err instanceof Error) {
        console.log(err)
        alert('Error saving record: ' + err.message);
      } else {
        alert('Error saving record: ' + JSON.stringify(err));
      }
    }
  };

</script>

<div class="p-4">
  <BirdSpeciesForm { speciesRecord }/>
  <div class="flex justify-between">
    <button class="w-24 btn" onclick={() => window.history.back()}>Cancel</button>
    <button class="w-24 btn btn-primary" onclick={handleSaveClick}>Save</button>
  </div>
</div>

