<script lang="ts">
  import { goto } from '$app/navigation';
  import { settingsCollection } from '$lib/db/dexie';

  console.log('about to get settings');
  settingsCollection.toArray().then((settingsArray) => {
    if (!settingsArray.length) {
      goto('/settings');
    } else {
      const settings = settingsArray[0];
      if (
        !settings ||
        !settings.user?.userInitials ||
        !settings.project ||
        !settings.projectSurvey
      ) {
        goto('/settings');
      } else {
        goto('/observations/new');
      }
    }
  });
</script>

<h1>Welcome to VP Pro!</h1>
<p>Get ready to fly...</p>
