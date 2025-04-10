<script lang="ts">
  import { page } from "$app/state";
  const projectID = page.url.pathname.split("/").pop();

</script>

<main class="p-4 flex flex-col gap-4">

  <p>We are at {page.url.pathname}</p>
  
  <button class="btn w-24" onclick={() => window.history.back()}>Done</button>
</main>