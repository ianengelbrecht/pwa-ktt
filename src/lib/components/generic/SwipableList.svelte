<script lang="ts">
  // The generic list component, with buttons to add new records, delete all records, and export to CSV.

  import type { Component } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import Select from 'svelte-select';
  import DeletableListElement from "$lib/components/generic/DeletableListElement.svelte";
  import { exportCSV } from '$lib/utils';

  let showSearch = $state(false)
  let showSort = $state(false)
  let sortField: {index: number, value: string, label: string} | null = $state(null)
  let ascending: boolean = $state(false)
  let dialogMessage: string = $state('Are you sure you want to delete this item?')

  interface Props<T extends Record<string, any>> { 
    items: T[], 
    deleteItem: (index: number) => void, 
    deleteAll: () => void, 
    ItemComponent: Component<{item: T}>, 
    sortable?: boolean 
  }
  
  const { items, deleteItem, deleteAll, ItemComponent, sortable = true }: Props<Record<string, any>> = $props()
  
  // same records, but sorted
  let displayData = $derived.by(() => {
    if (sortField) {
      return items.toSorted((a, b) => {
        if (a[sortField!.value] < b[sortField!.value]) return ascending ? -1 : 1;
        if (a[sortField!.value] > b[sortField!.value]) return ascending ? 1 : -1;
        return 0;
      });
    }
    else {
      return items
    }
  })

  let dataFields = items.length? Object.keys(items[0]) : []
  
  let dialog: HTMLDialogElement | null = null

  //show the modal to confirm the deletion
  const openConfirmDialog = (message?: string) => {
    if (message){
      dialogMessage = message
    }

    return new Promise((resolve) => {
      if (dialog) {
        dialog.addEventListener('close', function handler() {
          if (dialog) {
            dialog.removeEventListener('close', handler);
            resolve(dialog.returnValue === 'confirm');
          }
        });
        dialog.showModal();
      }
    });
  }

  //we always want to confirm before delete all
  const confirmAndDeleteAll = async () => {
    const confirmed = await openConfirmDialog('Are you sure you want to delete ALL items?');
    if (confirmed) {
      deleteAll();
    }
  }

  console.log(page.url.pathname)

</script>

<div class="flex justify-end gap-4 text-slate-500">
  {#if sortable}
  <button class="cursor-pointer" onclick={() => showSort = !showSort}>
    <span class={["material-symbols-outlined", {'text-slate-200 ': showSort}]}  style="font-size: 2.5rem;">sort</span>
  </button>
  {/if}

  <button class="cursor-pointer" onclick={() => showSearch = !showSearch}>
    <span class="material-symbols-outlined" class:text-slate-200={showSearch}  style="font-size: 2rem;">search</span>
  </button>
</div>

<div class="w-full flex flex-wrap items-center gap-2 mb-4">
  {#if showSearch}
    <input type="text" class="w-full md:w-1/2 lg:w-1/3 shrink-0 h-10 p-2 rounded bg-white text-black" placeholder="doesn't work yet">
  {:else}
    <span></span>
  {/if}

  {#if showSort && sortable}
  <div class="w-full md:w-1/2 lg:w-1/3 shrink-0 ml-auto flex items-center gap-2">
    <Select bind:value={sortField} items={dataFields} placeholder="Sort by field" class="text-black" />
    <button class="cursor-pointer" onclick={() => {ascending = !ascending}}>
      <span class="material-symbols-outlined" class:flip-icon={ascending} style="font-size: 2.5rem; transition: transform 0.2s ease-in-out;">sort</span>
    </button>
  </div>
  {/if}
</div>

<!-- show the list or a message if the list is empty -->
{#if displayData.length === 0}
  <div class="text-center text-slate-500 text-lg font-semibold">No items available</div>
{:else}
  <ul class="space-y-2">
    {#each displayData as item, index (item)}
      <DeletableListElement confirmDialog={openConfirmDialog} deleteHandler={() => deleteItem(index)}>
        <a href={page.url.pathname + '/' + item.timestamp} class="w-full">
          <ItemComponent item={item} />
        </a>
      </DeletableListElement>
    {/each}
  </ul>
  <div class="flex justify-left gap-8">
    <button onclick={() => exportCSV(displayData)} class="mt-4 p-2 bg-green-600 rounded cursor-pointer disabled:bg-transparent disabled:cursor-auto " disabled={!items.length}>Export CSV</button>
    <button onclick={confirmAndDeleteAll} class="mt-4 p-2 rounded border-2 border-gray-200 cursor-pointer disabled:cursor-auto" disabled={!items.length} >Delete all</button>
  </div>
{/if}

<!-- Add new record button, always present -->
<button class="fixed right-4 bottom-4 text-white bg-green-400 rounded-full shadow-xl p-4 cursor-pointer w-20 h-20 flex items-center justify-center border-4 border-slate-800"
  onclick={() => goto(page.url.pathname + '/new')}>
  <span class="material-symbols-outlined leading-none" style="font-size: 3rem;">add</span>
</button>

<!-- confirmation dialog for deleting items -->
<dialog id="confirmationDialog" class="rounded-xl p-6 shadow-lg w-80 m-auto" bind:this={dialog}>
  <p class="text-lg font-semibold mb-4">{dialogMessage}</p>
  <form method="dialog">
    <menu class="flex justify-end gap-3">
      <button value="cancel" class="px-4 py-2 rounded bg-gray-200 ">Cancel</button>
      <button id="confirmButton" value="confirm" class="px-4 py-2 rounded bg-red-600 text-white">Confirm</button>
    </menu>
  </form>
</dialog>

<style>
  .flip-icon {
    transform: scaleY(-1);
  }
</style>