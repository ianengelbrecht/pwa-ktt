<script lang="ts">
  import DeletableListElement from '../../components/DeletableListElement.svelte';
  import type { record}  from '$lib/types'

  let data: record[] = $state(JSON.parse(localStorage.getItem('geoData') || '[]'))
  const nums = $state([0, 1, 2, 3, 4, 5])

  const exportCSV = () => {
    const data = JSON.parse(localStorage.getItem('geoData') || '[]')
    if (data.length === 0) return alert('No data to export.')
    const header = ['timestamp', 'latitude', 'longitude', 'accuracy', 'deviceId']
    const rows = [header.join(',')].concat(
      data.map((d: record) => [d.timestamp, d.latitude, d.longitude, d.accuracy].join(','))
    )
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'coordinates.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const deleteItem = (index: number) => {
    data.splice(index, 1)
    localStorage.setItem('geoData', JSON.stringify(data))
    console.log('data now has ', data.length, 'items')
  }

</script>

<main id="listScreen" class="flex-1 p-4">
  <h1 class="text-xl mb-4">Saved Coordinates</h1>
  <ul id="savedList" class="space-y-2">
    {#each data as item, index (item.timestamp)}
      <DeletableListElement deleteHandler={() => deleteItem(index)} >
        <div class="flex justify-between items-center bg-slate-700 p-2 rounded text-white">
          <div class="flex flex-col">
            <span>Timestamp: {(new Date(item.timestamp)).toString().split('GMT')[0]}</span>
            <span>Latitude: {item.latitude}</span>
            <span>Longitude: {item.longitude}</span>
            <span>Accuracy: {item.accuracy}</span>
          </div>
        </div>
      </DeletableListElement>
    {/each}
  </ul>
  <button onclick={exportCSV} class="mt-4 p-2 bg-green-600 rounded">Export CSV</button>
</main>