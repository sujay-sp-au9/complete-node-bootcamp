/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoic3VqYXlzcCIsImEiOiJja2lsbzQyeG8wanluMzJwOTBrcThhM2hvIn0.u7HKBABIYGeqE5lEUeL_ug';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
});
