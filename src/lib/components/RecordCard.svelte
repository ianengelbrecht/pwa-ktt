<script>
  const { item } = $props()
</script>

<div class="flex flex-col group-hover:bg-slate-600">
  <span>Timestamp: {(new Date(item.timestamp)).toString().split('GMT')[0]}</span>
  <span>Latitude: {item.latitude}</span>
  <span>Longitude: {item.longitude}</span>
  <span>Accuracy: {item.accuracy}</span>
</div>