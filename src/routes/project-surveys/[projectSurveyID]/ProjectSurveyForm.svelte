<script lang="ts">
  import type { ProjectSurvey } from '$lib/types/types';

  let { projectSurvey = $bindable() }: { projectSurvey: ProjectSurvey } =
    $props();

  const handleStartDateChanged = (ev: Event) => {
    if (projectSurvey.startDate) {
      if (
        !projectSurvey.endDate ||
        projectSurvey.endDate < projectSurvey.startDate
      ) {
        projectSurvey.endDate = projectSurvey.startDate;
      }
    }
  };
</script>

<form class="flex flex-col gap-4">
  <label>
    Survey Name
    <input
      type="text"
      bind:value={projectSurvey.surveyName}
      placeholder="Survey Name"
      class="w-full input-base"
    />
  </label>
  <label>
    Season
    <input
      type="text"
      bind:value={projectSurvey.season}
      placeholder="Season"
      class="w-full input-base"
    />
  </label>
  <div class="flex gap-2">
    <label>
      Start Date
      <input
        type="date"
        class="input-base"
        bind:value={projectSurvey.startDate}
        onchange={handleStartDateChanged}
      />
    </label>
    <label>
      End Date
      <input
        type="date"
        bind:value={projectSurvey.endDate}
        class="input-base"
      />
    </label>
  </div>
</form>
