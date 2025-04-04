import Papa from 'papaparse';

export const exportCSV = <T>(data: T[], headers?: string[]) => {

  if (data.length === 0) return alert('No data to export.')

  const csv = Papa.unparse(data, { header:true });
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'data.csv'
  a.click()
  URL.revokeObjectURL(url)
}