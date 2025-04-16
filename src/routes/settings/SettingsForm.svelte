<script lang="ts">
  import type {
    Settings,
    Project,
    ProjectSurvey,
    Checklist,
  } from '$lib/types/types';
  import Select from 'svelte-select';

  interface SettingsFormProps {
    settingsRecord: Settings;
    projects: Project[];
    projectSurveys: ProjectSurvey[];
    checklists: Checklist[];
    handleProjectChange: () => void;
    handleAddProject: () => Promise<void>;
    handleAddSurvey: () => Promise<void>;
  }

  let {
    settingsRecord = $bindable(),
    projects,
    projectSurveys,
    checklists,
    handleProjectChange,
    handleAddProject,
    handleAddSurvey,
  }: SettingsFormProps = $props();
</script>

<form class="flex flex-col gap-4">
  <h4 class="text-lg">User details</h4>
  <fieldset class="aligned-fields">
    <label for="firstName">
      First Name:
      <input
        type="text"
        id="firstName"
        class="md:w-1/2 input-base"
        bind:value={settingsRecord.user!.firstName}
        required
      />
    </label>
    <label for="lastName">
      Last Name:
      <input
        type="text"
        id="lastName"
        class="md:w-1/2 input-base"
        bind:value={settingsRecord.user!.lastName}
        required
      />
    </label>
    <label for="userInitials">
      User Initials:
      <input
        type="text"
        id="userInitials"
        class="md:w-1/2 input-base"
        bind:value={settingsRecord.user!.userInitials}
        required
      />
    </label>
  </fieldset>
  <hr />
  <div>
    <p>Current Project:</p>
    <div class="flex gap-2">
      <!-- Seems many of the css variables don't work -->
      <Select
        bind:value={settingsRecord.project}
        items={projects}
        placeholder="Select a project"
        itemId={'projectID'}
        label={'projectName'}
        --placeholder-color="oklch(96.8% 0.007 247.896)"
        --background="oklch(44.6% 0.043 257.281)"
        --list-background="oklch(44.6% 0.043 257.281)"
        --list-border="4px solid white"
        --item-hover-bg="oklch(70.4% 0.04 256.788)"
        --item-hover-color="black"
        on:change={handleProjectChange}
      />
      <button class="btn" onclick={handleAddProject}>Add project</button>
    </div>
  </div>
  <div>
    <p>Current Survey/Season:</p>
    <div class="flex gap-2">
      <Select
        bind:value={settingsRecord.projectSurvey}
        items={projectSurveys}
        placeholder="Select a survey/season"
        itemId={'surveyID'}
        label={'surveyName'}
        --placeholder-color="oklch(70.4% 0.04 256.788)"
        --background="oklch(44.6% 0.043 257.281)"
        --list-background="oklch(44.6% 0.043 257.281)"
        --list-border="4px solid white"
        --item-hover-bg="oklch(70.4% 0.04 256.788)"
        --item-hover-color="black"
      />
      <button
        class="btn"
        onclick={handleAddSurvey}
        disabled={!settingsRecord.project}>Add season</button
      >
    </div>
  </div>
</form>

<style>
  .aligned-fields {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.5rem 1rem;
    align-items: center;
  }

  .aligned-fields label {
    display: contents; /* allows label text and input to align in separate cells */
  }
</style>
