import type { schemaField } from "$lib/types/types"

/**
 * Get a mappings object as {[schemaField]: [datasetField]}
 * @param fileRecord - The record from the CSV file
 * @param schema - The schema of the entity, with a displayName property for each field
 */
export function getFileMapping(fileRecord: Record<string, any>, schema: Record<string, schemaField>) {
  
  //we need the mapping of the property names from the csv file to the property names in the schema
  const mapping: Record<string, any> = {}
  const datasetFields = Object.keys(fileRecord)
  for (const [schemaField, { displayName }] of Object.entries(schema)) {
    mapping[schemaField] = null
    const matchingDatasetField = datasetFields.find((datasetField) => 
      datasetField.toLowerCase().replace(/\s+/g, '') === displayName.toLowerCase().replace(/\s+/g, ''))
    if (matchingDatasetField) {
      mapping[schemaField] = matchingDatasetField
    }
  }

  return mapping

}