import { readCSV } from "$lib/utils/readCSV";

export async function readCSVRecordsFile(file: File): Promise<Record<string, any>[]> {
  
  let records: Record<string, any>[] = []
  try {
    records = await readCSV(file)
    console.log('got', records.length, 'records')
  }
  catch(err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("An unknown error occurred while reading the file.");
    }
  }
  
  return records

}