<script lang="ts">
  import type { Project } from '$lib/types/types';
  import Select from 'svelte-select';

  let { project = $bindable() }: { project: Project } = $props();
</script>

<form class="flex flex-col gap-2">
  <label>
    Project name:
    <input
      type="text"
      class="w-full input-base"
      bind:value={project.projectName}
    />
  </label>
  <!-- We only autogenerate the project sites for new projects -->
  {#if !project.projectID}
    <div class="flex justify-between">
      <label>
        VPs:
        <input
          type="number"
          class="w-full input-base"
          min="0"
          bind:value={project.vpCount}
        />
      </label>
      <label>
        WTs:
        <input
          type="number"
          class="w-full input-base"
          min="0"
          bind:value={project.wtCount}
        />
      </label>
      <label>
        DTs:
        <input
          type="number"
          class="w-full input-base"
          min="0"
          bind:value={project.dtCount}
        />
      </label>
    </div>
  {/if}
  <div>
    <p>Checklist:</p>
    <div class="flex gap-2">
      <Select
        bind:value={project.checklist}
        items={checklists}
        placeholder="Select a project checklist"
        itemId={'checklistID'}
        label={'checklistName'}
        --placeholder-color="oklch(70.4% 0.04 256.788)"
        --background="oklch(44.6% 0.043 257.281)"
        --list-background="oklch(44.6% 0.043 257.281)"
        --list-border="4px solid white"
        --item-hover-bg="oklch(70.4% 0.04 256.788)"
        --item-hover-color="black"
      />
      <!-- Checklists must be added via checklists -->
      <!-- <button class="w-36 p-2  rounded border border-white hover:ring ring-white cursor-pointer" onclick={handleAddChecklist}>Add list</button> -->
    </div>
  </div>
</form>
