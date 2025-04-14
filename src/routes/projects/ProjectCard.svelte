<script lang="ts">
  import type { Project } from '$lib/types/types';
  let { item } = $props();
  const project = item as Project;
</script>

<a href={'/projects/' + project.projectID}>
  <div class="p-8">
    <p class="text-lg">{project.projectName}</p>
    <p class="text-xs">
      created: {project.createdDate?.split('T')[0]} by {project.createdBy}
    </p>
  </div>
</a>
