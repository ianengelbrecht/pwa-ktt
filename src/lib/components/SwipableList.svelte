<script lang="ts">
  import Select from 'svelte-select';
  import DeletableListElement from "./DeletableListElement.svelte";
  
  const { data, deleteItem, ItemComponent, confirmDeletion=true, sortable=true } = $props()
  
  let sortField: string |null = $state(null)

  let dataFields = Object.keys(data[0])
  
  let dialog: HTMLDialogElement | null = null

  //show the modal to confirm the deletion
  const openConfirmDialog = () => {
    return new Promise((resolve) => {
      if (confirmDeletion) {
        if (dialog) {
          dialog.addEventListener('close', function handler() {
            if (dialog) {
              dialog.removeEventListener('close', handler);
              resolve(dialog.returnValue === 'confirm');
            }
          });
          dialog.showModal();
        }
      }
      else {
        resolve(true);
      }
    });
  }

</script>

{#if sortable}
<div class="mb-4">
  <Select bind:value={sortField} items={dataFields} placeholder="Sort by field" class="text-black" />
</div>
{/if}

<ul class="space-y-2">
  {#each data as item, index (item)}
    <DeletableListElement confirmDialog={openConfirmDialog} deleteHandler={() => deleteItem(index)}>
      <a href={'/items/' + item.timestamp} class="w-full">
        <ItemComponent item={item} />
      </a>
    </DeletableListElement>
  {/each}
</ul>

<dialog id="confirmationDialog" class="rounded-xl p-6 shadow-lg w-80 m-auto" bind:this={dialog}>
  <p class="text-lg font-semibold mb-4">Are you sure you want to delete this item?</p>
  <form method="dialog">
    <menu class="flex justify-end gap-3">
      <button value="cancel" class="px-4 py-2 rounded bg-gray-200 ">Cancel</button>
      <button id="confirmButton" value="confirm" class="px-4 py-2 rounded bg-red-600 text-white">Confirm</button>
    </menu>
  </form>
</dialog>