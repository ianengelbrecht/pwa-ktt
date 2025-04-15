<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snapshot } from './$types';
  import { toast } from '@zerodevx/svelte-toast';
  import { dateTimeNow } from '$lib/utils';
  import { makeID } from '$lib/utils';
  import ObservationForm from './ObservationForm.svelte';
  import MapComponent from '$lib/components/MapComponent.svelte';
  import type { Observation, MapCoordinates } from '$lib/types/types';
  import { observationCollection } from '$lib/db/dexie';

  const { data } = $props();
  const { observation, settings, projectSites, species } = data;

  const isNew = observation === null;
  let showMap: boolean = $state(false);

  let { dateNow, timeNow } = dateTimeNow();

  let observationRecord: Observation = $state({
    observationID: null, //auto generated on save
    projectSurveyID: settings.projectSurvey?.surveyID!,
    projectSite: null,
    species: null,
    verbatimCoordinates: null, // the coordinates as entered by the user
    decimalLatitude: null, // the latitude
    decimalLongitude: null, // the longitude
    coordinatesAccuracy: null,
    coordinatesSource: null,
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
    flightEndReason: null,
  });

  if (observation) {
    observationRecord = observation;
  }

  onMount(() => {
    if (isNew) {
      const lastSavedSiteCode = localStorage.getItem('lastSavedSiteCode');
      if (lastSavedSiteCode && !observationRecord.projectSite) {
        const site = projectSites.find(
          (site) => site.siteCode === lastSavedSiteCode,
        );
        if (site) {
          observationRecord.projectSite = site.siteCode;
        }
      }
    }
  });

  //preserving state when navigating back, e.g. from the map
  export const snapshot: Snapshot<Observation> = {
    capture: () => observationRecord,
    restore: (value) => (observationRecord = value),
  };

  const recordValidation = (): boolean => {
    const requiredFields: string[] = [];

    if (!observationRecord.projectSite) {
      requiredFields.push('projectSite');
    }

    if (!observationRecord.species) {
      requiredFields.push('species');
    }

    if (!observationRecord.verbatimCoordinates) {
      requiredFields.push('coordinates');
    }

    // the complicated stuff about SCC and WEF species here

    // stuff about flights here

    if (requiredFields.length > 0) {
      alert(
        'The following fields must be filled in: ' + requiredFields.join('; '),
      );
    }

    return requiredFields.length == 0;
  };

  const handleSaveClick = async (ev: Event) => {
    ev.preventDefault();

    if (!recordValidation()) {
      return;
    }

    if (isNew) {
      // TODO set fields that need setting
      observationRecord.observationID = makeID();
      observationRecord.date = '';
      observationRecord.time = '';
    }

    try {
      await observationCollection.put($state.snapshot(observationRecord));
      localStorage.setItem('lastSavedSiteCode', observationRecord.projectSite!);
      toast.push('Observation saved');
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        alert('Error saving record: ' + err.message);
      } else {
        alert('Error saving record: ' + JSON.stringify(err));
      }
      console.error($state.snapshot(observationRecord));
      return;
    }

    if (isNew) {
      // Reset the record
      let { dateNow, timeNow } = dateTimeNow();
      observationRecord.observationID = null;
      observationRecord.species = null;
      observationRecord.verbatimCoordinates = null;
      observationRecord.decimalLatitude = null;
      observationRecord.decimalLongitude = null;
      observationRecord.coordinatesAccuracy = null;
      observationRecord.coordinatesSource = null;
      observationRecord.date = dateNow;
      observationRecord.time = timeNow;
      observationRecord.count = null;
      observationRecord.startDistance = null;
      observationRecord.startDirection = null;
      observationRecord.habitats = [];
      observationRecord.notes = null;
      observationRecord.isFlight = false;
      observationRecord.flightNumber = null;
      observationRecord.flightStart = null;
      observationRecord.flightEnd = null;
      observationRecord.flightNumber = null;
      observationRecord.flightStart = null;
      observationRecord.flightEnd = null;
      observationRecord.minHeight = null;
      observationRecord.maxHeight = null;
      observationRecord.averageHeight = null;
      observationRecord.flightMode = [];
      observationRecord.flightEndReason = null;

      window.scrollTo(0, 0);
    } else {
      //back where we came from
      window.history.back();
    }
  };

  const handleNewMapCoordinates = (newMapCoordinates: MapCoordinates) => {
    observationRecord.verbatimCoordinates = newMapCoordinates.coords;
    const [lat, lng] = newMapCoordinates.coords.split(',').map(Number);
    observationRecord.decimalLatitude = lat;
    observationRecord.decimalLongitude = lng;
    observationRecord.coordinatesAccuracy = null;
    observationRecord.coordinatesSource = newMapCoordinates.mapType + ' map';
  };
</script>

<main class="p-4 md:w-1/2 lg:w-1/3 flex flex-col gap-4">
  <div>
    <h2 class="text-xl">{isNew ? 'New' : 'Edit'} observation</h2>
    <p class="text-sm">
      Project/survey: {settings.project?.projectName || ''}
      {settings.projectSurvey?.surveyName || ''}
    </p>
  </div>
  <ObservationForm
    bind:observationRecord
    {projectSites}
    {species}
    handleMapButtonClick={() => (showMap = true)}
  />
  <div class="flex justify-between">
    <button class="btn" onclick={() => window.history.back()}
      >{isNew ? 'Done' : 'Cancel'}</button
    >
    <button class="btn btn-primary" onclick={handleSaveClick}
      >Save {isNew ? 'and new' : ''}</button
    >
  </div>
  <div class="fixed w-vw h-vh flex flex-col" class:hidden={showMap}>
    <div class="flex-1">
      <MapComponent
        startingPoint={observationRecord.decimalLatitude
          ? `${observationRecord.decimalLatitude!}, ${observationRecord.decimalLongitude!}`
          : null}
        startingZoom={12}
        {handleNewMapCoordinates}
      />
      <button class="w-full button" onclick={() => (showMap = false)}
        >Done</button
      >
    </div>
  </div>
</main>
