<script lang="ts">
  import { goto } from '$app/navigation';
  import { settingsCollection } from '$lib/db/dexie';

  console.log('about to get settings');
  settingsCollection.toArray().then((settings) => {
    console.log('managed to get the settings');
    if (!settings || settings.length === 0 || !settings[0].user?.userInitials) {
      goto('/settings');
    } else {
      goto('/observations/new');
    }
  });
</script>

<h1>Welcome to VP Pro!</h1>
<p>Get ready to fly...</p>
