/*eslint-disable*/
var mapboxgl = require('./../node_modules/mapbox-gl/dist/mapbox-gl.js');

console.log('hi, tousif here');

const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
var map = new mapboxgl.Map({
  container: 'YOUR_CONTAINER_ELEMENT_ID',
  style: 'mapbox://styles/mapbox/streets-v11'
});
