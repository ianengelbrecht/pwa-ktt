<script lang="ts">
  import type { ProjectSurvey } from "$lib/types/types"
  const { item } = $props()
  const projectSurvey = item as ProjectSurvey
</script>

<a href={"/project-surveys/" + projectSurvey.surveyID}>
  <div class="w-full p-4">
    <p>{projectSurvey.surveyName} ({projectSurvey.season})</p>
    <p class="text-xs">{projectSurvey.startDate} - {projectSurvey.endDate}</p>
  </div>
</a>