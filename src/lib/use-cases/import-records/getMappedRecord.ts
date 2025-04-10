

/**
 * Creates a record with a mapping from the CSV file to the entity schema and adds an ID field.
 * @param record - The record from the CSV file
 * @param mapping - The mapping from getFileMapping   
 * @param idField - The ID field for the entity, e.g. "speciesID" or "projectID"
 * @returns A mapped record with the ID field added and populated
 */
export function makeMappedRecord(record: Record<string, any>, mapping: Record<string, string>, idField: string) {
  const mappedRecord: Record<string, any> = {};
  for (const [key, value] of Object.entries(mapping)) {
    if (record[value]) {
      mappedRecord[key] = record[value];
    }
    else {
      mappedRecord[key] = null
    }
  }
  return mappedRecord;
}