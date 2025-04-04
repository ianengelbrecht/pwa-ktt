<script lang="ts">
  import {page} from '$app/state';
</script>
<p>Welcome to the page {page.url.href}!</p>
<button class="p-4 cursor-pointer" onclick={() => window.history.back()}>
  <span class="material-symbols-outlined">arrow_back</span>
</button>