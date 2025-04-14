<script lang="ts">
  import type { Species } from '$lib/types/types.d.ts';
  import { speciesSchema } from '$lib/schemas/schemas';
  let { item } = $props();
  const speciesRecord: Species = item as Species;
</script>

<a
  href={'/species/' + speciesRecord.speciesID}
  class="flex flex-col group-hover:bg-slate-600 p-2 rounded-lg"
>
  <p class="text-xs">{speciesSchema.commonName1.displayName}</p>
  <p class="text-lg font-bold underline">{speciesRecord.commonName1}</p>
  <p>{speciesRecord.commonName2}</p>
  <p class="italic">{speciesRecord.taxonName1}</p>
  <p class="text-xs">
    {[
      speciesRecord.priorityRank
        ? 'WEF Rank ' + speciesRecord.priorityRank
        : '',
      speciesRecord.scc ? speciesRecord.scc : '',
      speciesRecord.globalStatus ? speciesRecord.globalStatus : '',
      speciesRecord.regionalStatus
        ? speciesRecord.regionalStatus + ' (regional)'
        : '',
      speciesRecord.smallBird ? 'small bird' : '',
      speciesRecord.largeBird ? 'large bird' : '',
      speciesRecord.raptor ? 'raptor' : '',
      speciesRecord.waterbird ? 'waterbird' : '',
    ]
      .filter((x) => x)
      .join(' | ')}
  </p>
</a>
