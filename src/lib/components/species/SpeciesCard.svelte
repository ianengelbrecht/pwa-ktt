<script lang="ts">
  import type { Species } from "$lib/types/types.d.ts";
  import { speciesSchema } from "$lib/schemas/schemas";
  let {speciesRecord}: {speciesRecord: Species} =  $props()
</script>

{#snippet fieldName(text: string)}
  <div class="flex justify-right">
    <p class="text-sm">{text}</p>
  </div>
{/snippet}

<div>
  <p class="text-sm">Checklist name</p>
  <p class="text-lg font-bold">{speciesRecord.commonName1}</p>
  {@render fieldName(speciesSchema.commonName1.displayName)}
  <p class="text-sm">{speciesRecord.taxonName1}</p>
  {@render fieldName(speciesSchema.taxonName1.displayName)}
  <div>
    {
      [
        speciesRecord.priorityRank ? speciesRecord.priorityRank : '',
        speciesRecord.scc ? speciesRecord.scc : '',
        speciesRecord.globalStatus ? speciesRecord.globalStatus : '',
        speciesRecord.regionalStatus ? speciesRecord.regionalStatus + ' (regional)' : '',
        speciesRecord.smallBird ? 'small bird' : '',
        speciesRecord.largeBird ? 'large bird' : '',
        speciesRecord.raptor ? 'raptor' : '',
        speciesRecord.waterbird ? 'waterbird' : ''
      ].join(' | ')
    }
  </div>

</div>

