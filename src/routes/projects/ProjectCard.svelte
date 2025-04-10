<script lang="ts">

  import type { Project } from "$lib/types/types";
  let { item } = $props()
  const project = item as Project
  
</script>

<div class="p-8">
  <p class="text-lg">{project.projectName}</p>
  <p class="text-xs">created: {project.createdDate} by {project.createdBy}</p>
</div>




