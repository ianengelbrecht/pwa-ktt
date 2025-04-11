import type { Species } from "../../../lib/types/types";
import { settingsCollection, speciesCollection } from "../../../lib/db/dexie";

const settingsArray = await settingsCollection.toArray()
const settings = settingsArray[0] || null

let species: Species[] = []
if (settings.checklist) {
  species = await speciesCollection
  .where('checklistID')
  .equals(settings.checklist?.checklistID!)
  .toArray()

  species.sort((a, b) => {
    const nameA = (a.commonName1 || '').toLowerCase();
    const nameB = (b.commonName1 || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
}
else {
  console.error('Checklist not set in settings')
}

const filterText = 'bl har'
const searchString = filterText.trim().replace(/\s+/g, '.*\b') + '.*'
const regex = new RegExp(searchString, 'i')
const matchingSpecies = species.filter((species: Species) => {
  return regex.test(species.commonName1) ||  regex.test(species.commonName2) || regex.test(species.taxonName1) || regex.test(species.taxonName2)
})
console.log('got', matchingSpecies.length, 'matching species')