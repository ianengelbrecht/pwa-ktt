<script lang="ts">
  import { page } from '$app/state';
</script>

<div class="p-4 flex flex-col gap-4">
  <h2 class="text-xl">{page.status}</h2>
  <p>
    {page.error?.message || 'Something went wrong...'}
  </p>
  <button
    class="w-24 p-2 rounded border border-white"
    onclick={() => window.history.back()}>Back</button
  >
</div>
