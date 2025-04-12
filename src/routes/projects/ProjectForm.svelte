<script lang="ts">
  import type { Project } from "$lib/types/types";
  let { project = $bindable() }: { project: Project } = $props()

</script>

<form class="flex flex-col gap-2">
  <label>
    Project name:
    <input type="text" class="w-full input-base" bind:value={project.projectName} />
  </label>
  <!-- We only autogenerate the project sites for new projects -->
  {#if !project.projectID}
    <div class="flex justify-between">
      <label>
        VPs:
        <input type="number" class="w-full input-base" min="0" bind:value={project.vpCount}>
      </label>
      <label>
        WTs:
        <input type="number" class="w-full input-base" min="0" bind:value={project.wtCount}>
      </label>
      <label>
        DTs:
        <input type="number" class="w-full input-base" min="0" bind:value={project.dtCount}>
      </label>
    </div>
  {/if}
  
</form>