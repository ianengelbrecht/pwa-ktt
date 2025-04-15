<script lang="ts">
  let star: HTMLDivElement | null = null;

  function flyStar() {
    star?.classList.remove('fly'); // reset animation
    void star?.offsetWidth; // trigger reflow
    star?.classList.add('fly');
  }
</script>

<button onclick={flyStar}>Trigger Star</button>
<div id="star" class="star" bind:this={star}>⭐</div>

<style>
  .star {
    position: fixed;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%) scale(1);
    font-size: 2.5rem;
    color: gold;
    opacity: 0;
    pointer-events: none;
  }

  .star.fly {
    animation: fly-up 1.5s ease-out forwards;
  }

  @keyframes fly-up {
    0% {
      bottom: -50px;
      opacity: 0;
      transform: translateX(-50%) scale(1) rotate(0deg);
    }
    30% {
      opacity: 1;
      transform: translateX(-50%) scale(1.2) rotate(180deg);
    }
    100% {
      bottom: 50%;
      opacity: 0;
      transform: translateX(-50%) scale(0.8) rotate(360deg);
    }
  }
</style>
