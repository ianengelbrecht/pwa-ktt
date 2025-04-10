<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import type { Species } from "$lib/types/types";
  import { speciesSchema } from "$lib/schemas/schemas";
  import { readCSVRecordsFile, getFileMapping, makeMappedRecordWithIDField } from "$lib/use-cases/import-records";
  import { speciesCollection } from "$lib/db/dexie";

  const checklistID = page.url.searchParams.get('checklistID') || null;
  let fileList: FileList = $state(new FileList());
  const csvRecords: Record<string, any>[] = []
  let fileMapping: Record<string, string> = $state({});
  let availableFileFields: string[] = $state([]);

  if (!checklistID) {
    goto('/error', {  replaceState: true });
  }

  $effect(() => {
    if (fileMapping) {
      availableFileFields = Object.values(csvRecords[0]).filter(csvField => !Object.values(fileMapping).includes(csvField));
    }
  });

  // we should ideally be checking if the checklistID is valid, but for now we will just assume it is valid

  const handleMapFieldsClick = async (ev: Event) => {
    if (!fileList || fileList.length == 0) {
      alert('No files selected')
      return;
    }

    const file = fileList[0];
    try {
      let records = await readCSVRecordsFile(file)
      csvRecords.push(...records)
    }
    catch(err) {
      if (err instanceof Error) {
        alert('' + err.message)
      }
      else {
        alert('Unspecified error reading file')
      }

      return
    }

    fileMapping = getFileMapping(csvRecords[0], speciesSchema)

  }

  const handleImportClick = async (ev:Event) => {
    ev.preventDefault()

    for (const csvRecord of csvRecords) {
      const mappedRecord = makeMappedRecordWithIDField(csvRecord, fileMapping, 'speciesID')
      if (mappedRecord) {
        try {
          await speciesCollection.add((mappedRecord) as Species)
        }
        catch(err) {
          if (err instanceof Error) {
            alert('' + err.message)
          }
          else {
            alert('Unspecified error importing record')
          }
          return
        }
      }
    }
    alert('Records imported successfully')
    goto('/species' + '?checklistID=' + checklistID);
  }

</script>

<main class="p-4">
  <div class="mb-4">
    <h1 class="text-lg">Import Species</h1>
    <p class="">Select a file to import species records from</p>
  </div>
  <input type="file" accept=".csv" bind:value={fileList} />
  <button class="btn" disabled={!fileList || fileList.length == 0} onclick={handleMapFieldsClick}>Map fields</button>

  {#if fileMapping}
    {#each Object.entries(fileMapping) as [schemaField, matchingFileField]}
      <div class="flex justify-between">
        <span>{speciesSchema[schemaField].displayName}</span>
        <select name="" id="" bind:value={fileMapping[schemaField]}>
          <option value="">Dataset fields</option>
          {#each availableFileFields as fileField}
            <option value={fileField}>{fileField}</option>
          {/each}
        </select>
      </div>
    {/each}
  <button class="btn btn-primary"  onclick={handleImportClick}>Import records</button>
    
  {/if}

</main>