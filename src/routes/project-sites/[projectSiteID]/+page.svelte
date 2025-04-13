<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { error } from "@sveltejs/kit";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { dateTimeNow } from "$lib/utils";
  import { makeID } from "$lib/utils";
  import type { Project, ProjectSite } from "$lib/types/types";
  import { projectCollection, projectSiteCollection } from "$lib/db/dexie";
  import ProjectSiteForm from "./ProjectSiteForm.svelte";

  // make sure we can only get here if we have a projectID
  const projectID = page.url.searchParams.get("projectID");
  if (!projectID) {
    error(400, {
      message: "Oops, you got here with no projectID! That should not have happened..."
    });
  }

  

</script>

<main class="flex flex-col gap-4">

</main>