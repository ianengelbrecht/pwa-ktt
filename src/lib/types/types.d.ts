export type record = {
  timestamp: number, 
  latitude: number, 
  longitude: number, 
  accuracy: number
}

// 1. The schema object with display names
export const speciesSchema = {
  commonName1: { displayName: "Common Name (Birdlife SA 2024)" },
  commonName2: { displayName: "Afrikaans Name (Birdlife SA 2024" },
  taxonName1: { displayName: "Taxonomic Name (Birdlasser)" },
  taxonName2: { displayName: "Taxonomic Name (Birdlife SA 2024)" },
  priorty: { displayName: "WEF Priority" },
  scc: { displayName: "SCC" },
  priorityRank: { displayName: "WEF Priority Species Rank" },
  globalStatus: { displayName: "Global Status (IUCN, 2024)" },
  regionalStatus: { displayName: "Regional Status (Taylor et  al. 2015)" },
  text: { displayName: "Notes" },
  smallBird: { displayName: "Small Bird (<30cm)" },
  largeBird: { displayName: "Large Bird (>30cm)" },
  raptor: { displayName: "Raptor" },
  waterbird: { displayName: "Waterbird (Associated)" },
};


export type Species = {
  commonName1: string;
  commonName2: string;
  taxonName1: string;
  taxonName2: string;
  priorty: string;
  scc: string;
  priorityRank: string;
  globalStatus: string;
  regionalStatus: string;
  text: string;
  smallBird: number;
  largeBird: number;
  raptor: number;
  waterbird: number;
};
