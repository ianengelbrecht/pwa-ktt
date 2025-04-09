<script lang="ts">
  import nanoid from "$lib/utils/nanoid";
  import type {Observation} from "$lib/types/types";
  import { observationSchema } from "$lib/schemas/schemas";

  const { saveRecord } = $props()

  const dateTimeNowString = new Date().toString();
  const dateTimeNowParts = dateTimeNowString.split(' ');
  const dateNow = dateTimeNowParts.slice(1, 3).join(' ');
  const timeNow = dateTimeNowParts[4].split(':').slice(0, 2).join(':');

  console.log(dateTimeNowString)
  console.log(timeNow)

  const record: Observation = $state({
    observationID: null, //auto generated on save
    projectSurvey: null, // from settings
    projectSite: localStorage.getItem('observationSite') || '', // carry forward
    species: null,
    location: null, // from GPS
    locationAccuracy: 0, // from GPS
    date: new Date(dateNow).toISOString().split('T')[0], //date now, not UTC date
    time: timeNow, //ditto, see above
    observerInitials: null, // from settings
    count: null,
    startDistance: null,
    endDistance: null,
    habitats: [],
    notes: null,
    isFlight: false,
    flightNumber: null, // auto generated from initials and count
    flightStart: null,
    flightEnd: null,
  });

  $effect(() => {
    localStorage.setItem('observationSite', String(record.projectSite));
  });

  const sites = ['VP1', 'VP2', 'VP3', 'DT1', 'DT2', 'DT3', 'WT1', 'WT2', 'WT3', 'incidental'];

  const handleSaveClick = async (ev: Event) => {
    ev.preventDefault();

    // Perform save operation here

    record.observationID = nanoid();
    console.log('Saving record:', record);
    try {
      await saveRecord($state.snapshot(record));
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

<form id="observation-form" class="flex flex-col  p-4" >

  <label>
    Project Survey:
    <input type="text" name="survey" class="w-full input-base" bind:value={record.projectSurvey} />
  </label><br />
  <label>
    Site:
    <select name="" id="" bind:value={record.projectSite} class="w-full input-base">
      <option value="" selected>Select an option</option>
      {#each sites as site}
        <option value={site}>{site}</option>
      {/each}
    </select>
  </label>

  <div class="flex gap-2">
    <label>
      Date:
      <input type="date" name="date" class="w-full input-base" bind:value={record.date}/>
    </label><br />
  
    <label>
      Time:
      <input type="time" name="time" lang="en-GB" class="w-full input-base" bind:value={record.time} />
    </label><br />
  </div>

  <label>
    Location:
    <input type="text" name="location" class="w-full input-base" bind:value={record.location} />
  </label><br />

  <label>
    Observer:
    <input type="text" name="observer" class="w-full input-base" bind:value={record.observerInitials} />
  </label><br />

  <label>
    Notes:
    <textarea name="notes" class="w-full input-base" bind:value={record.notes} rows="4"></textarea>
  </label><br />

  <div class="flex justify-between">
    <button class="w-24 p-4 border rounded border-white  cursor-pointer" onclick={() => window.history.back()}>Done</button>
    <button class="p-4 border rounded border-white bg-green-400 cursor-pointer" onclick={handleSaveClick}>Save and new</button>
  </div>
</form>