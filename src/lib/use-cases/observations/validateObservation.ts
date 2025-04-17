import type { Observation } from '';
const recordValidation = (): boolean => {
  const requiredFields: string[] = [];

  //required fields
  if (!observationRecord.projectSite) {
    requiredFields.push('projectSite');
  }

  if (!observationRecord.observerInitials) {
    requiredFields.push('observerInitials');
  }

  if (!observationRecord.species) {
    requiredFields.push('species');
  }

  if (!observationRecord.verbatimCoordinates) {
    requiredFields.push('coordinates');
  }

  if (!observationRecord.date) {
    requiredFields.push('date');
  }

  if (!observationRecord.time) {
    requiredFields.push('time');
  }

  if (!observationRecord.count) {
    requiredFields.push('count');
  }

  // WEF / SCC required fields

  if (
    (observationRecord.species && observationRecord.species.scc) ||
    observationRecord.species?.priority
  ) {
    if (!observationRecord.startDistance) {
      requiredFields.push('distance');
    }

    if (!observationRecord.startDirection) {
      requiredFields.push('direction');
    }

    if (!observationRecord.habitats.length) {
      requiredFields.push('habitats');
    }
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
