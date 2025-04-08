import Papa from 'papaparse';

export function readCSV<T>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = []
    // Stream big file in worker thread
    Papa.parse(file, {
      worker: true,
      step: function(results) {
        console.log("Row:", results.data);
      },
      complete: function() {
        resolve(results)
      },
      error: function(error) {
        reject(error)
      },
    });
  })
};