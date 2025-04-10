<script lang="ts">
  import nanoid from "$lib/utils/nanoid";
  import ObservationForm from "../ObservationForm.svelte";
  import type {Observation} from "$lib/types/types";
  import { observationCollection, settingsCollection, speciesCollection } from "$lib/db/dexie";

  let { data } = $props()
  let coordsError: boolean = false

  const dateTimeNowString = new Date().toString();
  const dateTimeNowParts = dateTimeNowString.split(' ');
  const dateNow = dateTimeNowParts.slice(1, 3).join(' ');
  const timeNow = dateTimeNowParts[4].split(':').slice(0, 2).join(':');

  const observationRecord: Observation = $state({
    observationID: null, //auto generated on save
    project: null,
    projectSurvey: null, // from settings
    projectSite: null,
    species: null,
    location: null, // from GPS
    locationAccuracy: null, // from GPS
    date: null, //date now, not UTC date
    time: null, //ditto, see above
    observerInitials: null, // from settings
    count: null,
    startDistance: null,
    startDirection: null,
    habitats: [],
    notes: null,
    isFlight: false,
    flightNumber: null, // auto generated from initials and count
    flightStart: null,
    flightEnd: null,
    minHeight: null,
    maxHeight: null,
    averageHeight: null,
    flightMode: [],
    flightEndReason: null
  });

  observationRecord.project = data.settings.project
  observationRecord.projectSurvey = data.settings.projectSurvey
  observationRecord.observerInitials = data.settings.user?.userInitials || null // It should be there

  let coordsWatcherID = navigator.geolocation.watchPosition(position => {
      coordsError = false
      observationRecord.location = `${Number(position.coords.latitude.toFixed(6))}, ${Number(position.coords.longitude.toFixed(6))}`
      observationRecord.locationAccuracy = position.coords.accuracy.toFixed(0)
    }, (error) => {
      coordsError = true
      console.error(error)  
    }, 
    {
      enableHighAccuracy: true
    }
  )

  const recordValidation = (): boolean => {
    const requiredFields: string[] = []
    if (!observationRecord.location) {
      requiredFields.push('location')
    }

    // the complicates stuff about SCC and WEF species here

    // stuff about flights here

    if (requiredFields.length > 0) {
      alert('The following fields must be filled in: ' + requiredFields.join('; '))
    }
    return requiredFields.length > 0
  }


  const handleSaveClick = async (ev: Event) => {
    ev.preventDefault();

    if (!recordValidation()) {
      return
    }

    // TODO set fields that need setting
    observationRecord.observationID = nanoid();
    observationRecord.date = ''
    observationRecord.time = ''

    try {
      await observationCollection.add($state.snapshot(observationRecord));
    }
    catch(err) {
      if (err instanceof Error) {
        console.log(err)
        alert('Error saving record: ' + err.message);
      } else {
        alert('Error saving record: ' + JSON.stringify(err));
      }
      return
    }

    //reset the record for the next entry
    observationRecord.observationID = null
    observationRecord.species = null
    observationRecord.date = null
    observationRecord.time = null 
    observationRecord.count = null
    observationRecord.startDistance = null
    observationRecord.startDirection = null
    observationRecord.habitats = []
    observationRecord.notes = null
    observationRecord.isFlight = false
    observationRecord.flightNumber = null
    observationRecord.flightStart = null
    observationRecord.flightEnd = null
    observationRecord.flightNumber = null
    observationRecord.flightStart = null
    observationRecord.flightEnd = null
    observationRecord.minHeight = null
    observationRecord.maxHeight = null
    observationRecord.averageHeight = null
    observationRecord.flightMode = []
    observationRecord.flightEndReason = null
  };
</script>

<main class="p-4">
  <p class="text-sm">{observationRecord.project?.projectName} {observationRecord.projectSurvey?.surveyName}</p>
  <ObservationForm {observationRecord} projectSites={data.projectSites} />
  <div class="flex justify-between">
    <button class="w-24 p-4 border rounded border-white  cursor-pointer" onclick={() => window.history.back()}>Done</button>
    <button class="p-4 border rounded border-white bg-green-400 cursor-pointer" onclick={handleSaveClick}>Save and new</button>
  </div>
</main>