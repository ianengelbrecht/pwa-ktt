import nanoid from "$lib/utils/nanoid";

/**
 * Creates a record with a mapping from the CSV file to the entity schema and adds an ID field.
 * @param record - The record from the CSV file
 * @param mapping - The mapping from getFileMapping   
 * @param idField - The ID field for the entity, e.g. "speciesID" or "projectID"
 * @returns A mapped record with the ID field added and populated
 */
export function makeMappedRecordWithIDField(record: Record<string, any>, mapping: Record<string, string>, idField: string) {
  const mappedRecord: Record<string, any> = {};
  for (const [key, value] of Object.entries(mapping)) {
    mappedRecord[value] = record[key];
  }
  mappedRecord[idField] = nanoid();
  return mappedRecord;
}