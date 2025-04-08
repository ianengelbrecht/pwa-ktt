<script lang="ts">

  let { saveRecord }: {saveRecord: (name:string) => void} = $props(); // State variable for checklist data
  let checklistName: string = $state(''); // State variable for checklist name

</script>

<form id="checklist-form">

  <label>
    Checklist Name:
    <input type="text" name="checklistname" bind:value={checklistName}/>
  </label>

  <button class="fixed right-4 bottom-4 text-white bg-green-400 rounded-full shadow-xl p-4 cursor-pointer w-20 h-20 flex items-center justify-center border-4 border-slate-800"
  onclick={() => saveRecord(checklistName)}
  >
    <span class="material-symbols-outlined leading-none" style="font-size: 3rem;">check</span>
  </button>
  
</form>
