import Papa from 'papaparse';

export function readCSV<T>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const csvRecords: T[] = []
    // Stream big file in worker thread
    Papa.parse(file, {
      worker: true,
      header: true,
      step: function(results) {
        csvRecords.push(results.data as T);
      },
      complete: function() {
        resolve(csvRecords)
      },
      error: function(error) {
        reject(error)
      },
    });
  })
};