<script lang="ts">

const data = JSON.parse(localStorage.getItem('geoData') || '[]')

const exportCSV = () => {
  const data = JSON.parse(localStorage.getItem('geoData') || '[]')
  if (data.length === 0) return alert('No data to export.')
  const header = ['timestamp', 'latitude', 'longitude', 'accuracy', 'deviceId']
  const rows = [header.join(',')].concat(
    data.map((d) => [d.timestamp, d.latitude, d.longitude, d.accuracy, d.deviceId].join(','))
  )
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'coordinates.csv'
  a.click()
  URL.revokeObjectURL(url)
}

</script>

<main id="listScreen" class="flex-1 p-4 hidden">
  <h1 class="text-xl mb-4">Saved Coordinates</h1>
  <ul id="savedList" class="space-y-2"></ul>
  <button onclick={exportCSV} class="mt-4 p-2 bg-green-600 rounded">Export CSV</button>
</main>