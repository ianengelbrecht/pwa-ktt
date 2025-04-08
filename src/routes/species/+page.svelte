<script lang="ts">
  import { onMount } from "svelte";
  import SwipableList from "$lib/components/generic/SwipableList.svelte";
  import SpeciesCard from "./SpeciesCard.svelte";
  import type { Species } from "$lib/types/types";
  import { speciesSchema } from "$lib/schemas/schemas";
  import { readCSV } from "$lib/utils/readCSV";
  import nanoid from "$lib/utils/nanoid";

  import { speciesCollection } from "$lib/db/dexie"
  const species: Species[] = $state([]);

  let fileInput: HTMLInputElement | null = null;

  onMount(() => {
    speciesCollection.toArray().then((speciesRecords) => {
      speciesRecords.forEach((speciesRecord) => {
        species.push(speciesRecord);
      });
    });
  });

  const deleteSpecies = (speciesRecord: Record<string, any>) => {
    speciesCollection.where('speciesID').equals(speciesRecord.speciesID).delete().then(() => {
      const index = species.findIndex((record) => record === speciesRecord as Species);
      species.splice(index, 1);
    });
  }
  
  const deleteAllSpecies = () => {
    speciesCollection.clear().then(() => {
      species.length = 0;
    });
  }

  const importSpecies = async () => {
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      
      try {
        const records: Record<string, any>[] = await readCSV(file)
        console.log('got', records.length, 'records')

        //we need the mapping of the property names from the csv file to the property names in the schema
        const mapping: Record<string, any> = {}
        const datasetFields = Object.keys(records[0])
        for (const [key, value] of Object.entries(speciesSchema)) {
          const matchingDatasetField = datasetFields.find((field) => 
            field.toLowerCase().replace(/\s+/g, '') === value.displayName.toLowerCase().replace(/\s+/g, ''))
          if (matchingDatasetField) {
            mapping[matchingDatasetField] = key
          }
          else {
            alert(value.displayName + ' not found in csv file') //TODO we need an actual mapping form
          }
        }

        for (const record of records) {
          const mappedRecord: Record<string, any> = {}
          for (const [key, value] of Object.entries(mapping)) {
            mappedRecord[value] = record[key]
          }
          mappedRecord.speciesID = nanoid()
          await speciesCollection.add(mappedRecord as Species)
          species.push(mappedRecord as Species)
        }
      }
      catch(err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("An unknown error occurred while reading the file.");
        }
      }
    }
    else {
      alert('Please select a file to import.');
    }
  }

</script>

<main id="listScreen" class="flex-1 p-4">
  <div class="mb-4">
    <h1 class="text-xl">Species</h1>
    <p class="text-xs">South African birds checklist</p> <!-- TODO, add this dunamically from settings -->
  </div>
  <SwipableList items={species} deleteItem={deleteSpecies} deleteAll={deleteAllSpecies} itemIDfield={'speciesID'} ItemComponent={SpeciesCard}/>
  {#if !species.length}
    <button class="rounded p-2 border border-slate-200 mt-2 hover:ring" onclick={importSpecies}>Import species</button>
    <input type="file" name="" id="" accept=".csv" bind:this={fileInput}>
  {/if}
</main>