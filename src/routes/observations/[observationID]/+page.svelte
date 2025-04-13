<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { dateTimeNow } from "$lib/utils";
  import { makeID } from "$lib/utils";
  import ObservationForm from "./ObservationForm.svelte";
  import type { Observation } from "$lib/types/types";
  import { observationCollection } from "$lib/db/dexie";

  const { data } = $props()
  const { observation, settings, projectSites, species } = data

  const isNew = observation === null

  let coordsError: boolean = $state(false)

  let { dateNow, timeNow } = dateTimeNow()

  let observationRecord: Observation = $state({
    observationID: null, //auto generated on save
    projectSurveyID: settings.projectSurvey?.surveyID!, 
    projectSite: null,
    species: null,
    location: null, // from GPS
    locationAccuracy: null, // from GPS
    date: dateNow, //date now, not UTC date
    time: timeNow, //ditto, see above
    observerInitials: data.settings.user?.userInitials!,
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

  if (observation) {
    observationRecord = observation
  }

  // start watching coordinates
  navigator.geolocation.watchPosition(position => {
      coordsError = false
      observationRecord.location = `${Number(position.coords.latitude.toFixed(6))}, ${Number(position.coords.longitude.toFixed(6))}`
      observationRecord.locationAccuracy = Number(position.coords.accuracy.toFixed(0))
    }, (error) => {
      // see https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError
      // TODO we need to handle permission errors here specifically... There's a permissions API
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

    if (!observationRecord.species) {
      requiredFields.push('species')
    }

    // the complicated stuff about SCC and WEF species here

    // stuff about flights here

    if (requiredFields.length > 0) {
      alert('The following fields must be filled in: ' + requiredFields.join('; '))
    }

    return requiredFields.length == 0
  }

  const handleSaveClick = async (ev: Event) => {
    ev.preventDefault();

    if (!recordValidation()) {
      return
    }

    if (isNew) {
      // TODO set fields that need setting
      observationRecord.observationID = makeID();
      observationRecord.date = ''
      observationRecord.time = ''
    }

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

    if (isNew) {
      // Reset the record
      let { dateNow, timeNow } = dateTimeNow()
      observationRecord.observationID = null
      observationRecord.species = null
      observationRecord.date = dateNow
      observationRecord.time = timeNow 
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

      toast.push('Observation saved')
      
      window.scrollTo(0, 0)

    }
    else {
      //back where we came from 
      window.history.back()
    }
  };

</script>

<main class="p-4 flex flex-col gap-4">
  <div>
    <h2 class="text-xl">{ isNew ? 'New' : 'Edit'} observation</h2>
    <p class="text-sm">Project/survey: {settings.project?.projectName || ''} {settings.projectSurvey?.surveyName || ''}</p>
  </div>
  <ObservationForm 
  bind:observationRecord
  {projectSites} 
  {species} 
  />
  <div class="flex justify-between">
    <button class="btn" onclick={() => window.history.back()}>{ isNew ? 'Done' : 'Cancel'}</button>
    <button class="btn btn-primary" onclick={handleSaveClick}>Save {isNew ? 'and new' : ''}</button>
  </div>
</main>