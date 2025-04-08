import Papa from 'papaparse';

export const exportCSV = <T extends Record<string, any>>(data: T[], headers?: string[]) => {

  if (data.length === 0) return alert('No data to export.')

  let exportData: Record<string, any>[] = [];

  if (headers) {
    if (!Object.keys(data[0]).some(key => headers.includes(key))) {
      return alert('No matching headers found in data.')
    }
    else {
      exportData = data.map(item => {
        const filteredItem: Record<string, any> = {}
        headers.forEach(header => {
          if (item.hasOwnProperty(header)) {
            filteredItem[header] = item[header]
          }
        })
        return filteredItem
      })
    }
  }

  if (exportData.length === 0) {
    exportData = data
  }

  const csv = Papa.unparse(exportData, { header: true });
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'data.csv'
  a.click()
  URL.revokeObjectURL(url)
}