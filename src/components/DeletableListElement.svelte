<script lang="ts">
  import { slide } from 'svelte/transition'
  import { swipeable } from '@react2svelte/swipeable';
  import type { SwipeEventData } from '@react2svelte/swipeable';

  const { deleteHandler, children } = $props()

  let bg: HTMLDivElement | null = null
  let container: HTMLDivElement | null = null

  const swipeHandler = (e: CustomEvent<SwipeEventData>) => {
    if (container && bg && e.detail.dir == "Left") {
      container.style.transform = `translateX(${e.detail.deltaX}px)`
      bg.style.opacity = `1`
    }
  }

  function swipeleftHandler(e: CustomEvent<SwipeEventData>) {
    if (container && bg) {
      if (e.detail.deltaX < -100) {
        container.style.transform = `translateX(-100%)`
        deleteHandler()
      }
      else {
        container.style.transform = `translateX(0)`
        bg.style.opacity = '0';
      }
    } 
  }

  function swipeRightHandler(e: CustomEvent<SwipeEventData>) {
    if (container) container.style.transform = `translateX(0)`
    bg.style.opacity = '0';
    // console.log('User swiped right!');
    // e.detail
  }

</script>
<li id="wrapper" class="relative rounded" transition:slide>
  <div id="background" class="absolute inset-0 bg-red-600 opacity-0 transition-opacity flex justify-end items-center" bind:this={bg}>
    <span class="p-4">DELETE</span>
  </div>
  <div id="container" 
      bind:this={container} 
      class="swipe-transition bg-slate-700 rounded p-2 flex items-center justify-between"
      style="color: aliceblue; "
      use:swipeable 
      onswiping={swipeHandler}
      onswipedleft={swipeleftHandler}
    >
    <div id="content">
      {@render children()}
    </div>
    <button class="p-4 cursor-pointer" onclick={deleteHandler}>
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