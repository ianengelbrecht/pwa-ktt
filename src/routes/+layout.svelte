<script lang="ts">
	
  import '../app.css';
  import { SvelteToast } from '@zerodevx/svelte-toast'
	
	let { children } = $props();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.onupdatefound = () => {
        const newWorker = reg.installing
        if (newWorker) {
          newWorker.onstatechange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (confirm('A new version is available. Reload now?')) {
                window.location.reload()
              }
            }
          }
        }
      }
    })
  }
</script>

<div class="h-vh flex flex-col">

  <nav class="bg-slate-800 p-4 flex justify-between">
    <a href="/demo/new">Capture</a>
    <a href="/demo">Saved</a>
  </nav>
  
  <div class="flex-1 min-h-0 overflow-auto">
    {@render children()}
  </div>
</div>

<SvelteToast options={{ duration: 500, reversed: true, intro: { y: 20 } }} />

<div class="fixed bottom-4 right-4">
  v1.2.2
</div>

