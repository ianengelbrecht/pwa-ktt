<script lang="ts">
	
  import '../app.css';
  import { SvelteToast } from '@zerodevx/svelte-toast'
	
	let { children } = $props();

  //switching off service worker for now
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('/sw.js').then(reg => {
  //     reg.onupdatefound = () => {
  //       const newWorker = reg.installing
  //       if (newWorker) {
  //         newWorker.onstatechange = () => {
  //           if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
  //             if (confirm('A new version is available. Reload now?')) {
  //               window.location.reload()
  //             }
  //           }
  //         }
  //       }
  //     }
  //   })
  // }

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.getRegistrations().then(registrations => {
  //     for (const reg of registrations) {
  //       reg.unregister();
  //     }
  //   });
  // }
</script>

<div class="h-vh flex flex-col">

  <nav class="w-full bg-slate-800 p-4 flex justify-end gap-4 text-slate-200">
    <a href="/demo">Demo</a>
    <a href="/checklists">Checklists</a>
    <a href="/observations">Observations</a>
    <a href="/projects">Projects</a>
    <a href="/settings">Settings</a>
  </nav>
  
  <div class="flex-1 min-h-0 overflow-auto">
    {@render children()}
  </div>
</div>

<SvelteToast options={{ duration: 1000, reversed: true, intro: { y: 20 } }} />

<div class="fixed bottom-4 right-4">
  v1.2.2
</div>

