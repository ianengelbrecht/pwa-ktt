## db directory - the database

This is quite complex so that the database is abstracted from the app. 

We have the following:

- [databasename].ts - e.g. dexie.ts, which provides that particular database, defines the tables/collections, etc, etc. 
- types.d.ts - the data types that go back and forth into the database, which may differ from what we have in the application (no nested objects, etc.)
- dbInterface - implements the dbInterface using the provided database. 
- /dbAdapter - maps between application and database objects
- index.ts - pulls everything out of the adapter again and makes it available to the rest of the app via `import * from './lib/db'

Note that the db service interfaces are defined in the types.d.ts file, and can be extended there to include additional database methods if they're needed.

Ideally we want dependency injection at some point so this might all be rearranged.
