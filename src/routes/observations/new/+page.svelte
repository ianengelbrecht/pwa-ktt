<script lang="ts">
  import nanoid from "$lib/utils/nanoid";
  import ObservationForm from "../ObservationForm.svelte";
  import type {Observation} from "$lib/types/types";
  import { observationCollection, speciesCollection } from "$lib/db/dexie";

  let { data } = $props()

  let coordsError: boolean = false

  let observationRecord: Observation = $state({
    observationID: null, //auto generated on save
    project: data.settings.project,
    projectSurvey: data.settings.projectSurvey, // from settings
    projectSite: null,
    species: null,
    location: null, // from GPS
    locationAccuracy: null, // from GPS
    date: null, //date now, not UTC date
    time: null, //ditto, see above
    observerInitials: data.settings.user?.userInitials || null, // from settings
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
    
    if (!observationRecord.projectSite) {
      requiredFields.push('projectSite')
    }
    
    if (!observationRecord.location) {
      requiredFields.push('location')
    }

    // the complicates stuff about SCC and WEF species here

    // stuff about flights here

    if (requiredFields.length > 0) {
      alert('The following fields must be filled in: ' + requiredFields.join('; '))
    }
    return requiredFields.length == 0
  }


  const handleSaveClick = async (ev: Event) => {
    ev.preventDefault();

    console.log('running validations')
    if (!recordValidation()) {
      return
    }

    // TODO set fields that need setting
    console.log('settings values')
    observationRecord.observationID = nanoid();
    observationRecord.date = ''
    observationRecord.time = ''

    console.log('saving record')
    try {
      await observationCollection.put($state.snapshot(observationRecord));
    }
    catch(err) {
      if (err instanceof Error) {
        console.log(err)
        alert('Error saving record: ' + err.message);
      } else {
        alert('Error saving record: ' + JSON.stringify(err));
      }
      console.error($state.snapshot(observationRecord))
      return
    }

    //reset the record for the next entry
    console.log('resetting record')
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

<main class="p-4 flex flex-col gap-4">
  <p class="text-sm">{observationRecord.project?.projectName} {observationRecord.projectSurvey?.surveyName}</p>
  <ObservationForm bind:observationRecord={observationRecord} projectSites={data.projectSites} species={data.species} />
  <div class="flex justify-between">
    <button class="w-24 p-4 border rounded border-white  cursor-pointer" onclick={() => window.history.back()}>Done</button>
    <button class="p-4 border rounded border-white bg-green-400 cursor-pointer" onclick={handleSaveClick}>Save and new</button>
  </div>
</main>