<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import nanoid from "$lib/utils/nanoid";
  import type { Species } from "$lib/types/types";
  import { speciesSchema } from "$lib/schemas/schemas";
  import { readCSVRecordsFile, getFileMapping, makeMappedRecord } from "$lib/use-cases/import-records";
  import { speciesCollection } from "$lib/db/dexie";

  const checklistID = page.url.searchParams.get('checklistID') || null;
  if (!checklistID) {
    goto('/error', {  replaceState: true });
  }

  let fileInput: HTMLInputElement | null = $state(null)
  let selectedFile: File | null = $state(null)
  const csvRecords: Record<string, any>[] = []
  let fileMapping: Record<string, string> = $state({});
  let availableFileFields: string[] = $state([]);

  $effect(() => {
    if (fileMapping && csvRecords && csvRecords.length) {
      availableFileFields = Object.keys(csvRecords[0]).filter(csvField => !Object.values(fileMapping).includes(csvField));
    }
  });

  // we should ideally be checking if the checklistID is valid, but for now we will just assume it is valid

  const handleChooseFileClick = (ev:Event) => {
    ev.preventDefault()
    fileInput?.click()
  }

  const handleFileSelected = (ev: Event) => {
    if (fileInput && fileInput.files?.length) {
      selectedFile = fileInput.files[0]
      console.log('selected file added')
    }
    else {
      selectedFile =  null
    }
  }

  /**
   * Read the file contents and create the mapping
   */
  const handleMapFieldsClick = async (ev: Event) => {
    if (!selectedFile) {
      alert('No files selected')
      return;
    }
    else {
      try {
        let records = await readCSVRecordsFile(selectedFile)
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


  }

  const handleImportClick = async (ev:Event) => {
    ev.preventDefault()

    for (const csvRecord of csvRecords) {
      const mappedRecord = makeMappedRecord(csvRecord, fileMapping, 'speciesID') as Species
      if (mappedRecord) {
        mappedRecord.speciesID = nanoid()
        mappedRecord.checklistID = checklistID!
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
  <input type="file" accept=".csv" class="invisible" bind:this={fileInput} onchange={handleFileSelected}/>
  <div class="flex gap-4">
    <button class="w-48 btn" onclick={handleChooseFileClick}>Choose CSV file</button>
    <button class="w-36 btn" class:btn-primary={selectedFile} disabled={!selectedFile} onclick={handleMapFieldsClick}>Map fields</button>
  </div>
  {#if selectedFile}
    <p>{selectedFile.name}</p>
  {/if}

  <div class="mt-4 flex flex-col gap-2">
    {#if fileMapping && Object.keys(fileMapping).length > 0 }
      {#each Object.keys(fileMapping).filter(x => !x.endsWith('ID')) as schemaField}
        <div class="">
          <span>{speciesSchema[schemaField].displayName}</span>
          <select name="" id="" class="p-1 rounded text-white bg-slate-400" bind:value={fileMapping[schemaField]}>
            <option value="">no mapping</option>
            {#if fileMapping[schemaField]}
              <option value={fileMapping[schemaField]}>{fileMapping[schemaField]}</option>
            {/if}
            {#each availableFileFields as fileField}
              <option value={fileField}>{fileField}</option>
            {/each}
          </select>
        </div>
      {/each}
      <div class="flex gap-4">
        <button class="w-24 btn" onclick={() => window.history.back()}>Cancel</button>
        <button class="w-24 btn" onclick={() => console.log($state.snapshot(fileMapping))}>Cancel</button>
        <button class="w-24 btn btn-primary" onclick={handleImportClick}>Import</button>
      </div>
    {/if}
  </div>
</main>