<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import ProjectSurveyForm from "../ProjectSurveyForm.svelte";
  
  // make sure we can only get here if we have a projectID
  const projectID = page.url.searchParams.get("projectID");
  if (!projectID) {
    //redirect to 400 error page
    goto('/error', { replaceState: true })
  }

</script>

<ProjectSurveyForm projectID={projectID!} />