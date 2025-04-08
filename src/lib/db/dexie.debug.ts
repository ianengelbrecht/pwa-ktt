// I tried this for testing in deno but dexie is not picking up the polyfill...

import "https://deno.land/x/indexeddb@v1.1.0/polyfill_memory.ts";
import * as dexie from './dexie';

dexie.speciesCollection.add({speciesID: 'asfdasdf'}).then(() => {
  console.log('Species added successfully');
}).catch((error) => {
  console.error('Error adding species:', error);
});