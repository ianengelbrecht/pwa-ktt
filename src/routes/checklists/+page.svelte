<script lang="ts">
  import type { Checklist } from "$lib/types/types.d.ts";
  import SwipableList from "$lib/components/generic/SwipableList.svelte";
  import CheckListCard from "$lib/components/checklists/CheckListCard.svelte";

  const checklists: Checklist[] = []

</script>

<SwipableList items={checklists} deleteItem={() => {}} ItemComponent={CheckListCard} sortable={true} />