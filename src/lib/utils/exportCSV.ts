import Papa from 'papaparse';

/**
 * A generic csv export function that wraps mapping functions for the input data
 * @param data An array of objects to convert to CSV
 * @param mappingFunction The mapping function that flattens the specific data type for CSV export
 * @param fileName The name of the file to download (optional), e.g. 'observations.csv'. Defaults to 'data.csv'
 */
export const exportCSV = <T extends Record<string, any>>(data: T[], mappingFunction?: (record: T) => Record<string, any> | null, fileName?: string): void => {

  if (!fileName) {
    fileName = 'data.csv'
  }
  else {
    if (!fileName.toLowerCase().endsWith('.csv')) {
      fileName += '.csv'
    } 
  }

  if (data.length === 0) return alert('No data to export.')

  let exportData = data

  if (mappingFunction) {
    exportData = data.map(mappingFunction).filter((record) => record !== null) as T[]
  }

  if (exportData.length === 0) return alert('no records survived mapping...')

  const csv = Papa.unparse(exportData, { header: true });
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)

}