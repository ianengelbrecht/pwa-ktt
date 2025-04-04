<script lang="ts">
  /// still uses old event handler syntax, see the repo for issue submitted
  import { slide } from 'svelte/transition'
  import { swipeable } from '@react2svelte/swipeable';
  import type { SwipeEventData } from '@react2svelte/swipeable';

  const { confirmDialog, deleteHandler, children } = $props()

  let bg: HTMLDivElement | null = null
  let container: HTMLDivElement | null = null

  const swipeHandler = (e: CustomEvent<SwipeEventData>) => {
    if (container && bg && e.detail.dir == "Left") {
      container.style.transform = `translateX(${e.detail.deltaX}px)`
      bg.style.opacity = `1`
    }
  }

  async function swipeleftHandler(e: CustomEvent<SwipeEventData>) {
    if (container && bg) {
      if (e.detail.deltaX < -100) {
        const conf = await confirmDialog()
        if (conf) {
          container.style.transform = `translateX(-100%)`
          bg.style.opacity = '0';
          deleteHandler()
        }
        else {
          container.style.transform = `translateX(0)`
          bg.style.opacity = '0';
        }
      }
      else {
        container.style.transform = `translateX(0)`
        bg.style.opacity = '0';
      }
    } 
  }

  async function deleteButtonHandler() {
    const conf = await confirmDialog()
    if (conf) {
      deleteHandler()
    }
  }

</script>
<li id="wrapper" class="relative rounded" transition:slide>
  <div id="background" class="absolute inset-0 bg-red-600 opacity-0 transition-opacity flex justify-end items-center" bind:this={bg}>
    <span class="p-4">DELETE</span>
  </div>
  <div id="container" 
      bind:this={container} 
      class="group swipe-transition bg-slate-700 rounded p-4 flex items-center justify-between hover:bg-slate-600"
      style="color: aliceblue; "
      use:swipeable 
      on:swiping={swipeHandler}
      on:swipedleft={swipeleftHandler}
    >
    <div id="content" class="w-full" >
      {@render children()}
    </div>
    <button class="p-4 cursor-pointer" on:click={deleteButtonHandler}>
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
</li>

<style>
  #background {
    pointer-events: none;
  }

  .swipe-transition {
    transition: transform 0.2s ease-out;
  }
</style>