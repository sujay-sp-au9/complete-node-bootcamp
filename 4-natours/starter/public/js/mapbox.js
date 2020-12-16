/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoic3VqYXlzcCIsImEiOiJja2lsbzQyeG8wanluMzJwOTBrcThhM2hvIn0.u7HKBABIYGeqE5lEUeL_ug';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/sujaysp/ckioc3cj34n9517qvv97qy5np',
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  const elem = document.createElement('div');
  elem.className = 'marker';
  new mapboxgl.Marker({
    element: elem,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    right: 100,
    left: 100,
  },
});
