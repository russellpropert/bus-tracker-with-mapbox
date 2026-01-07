import { MAPBOX_API_KEY, MBTA_API_KEY } from './config.js';

mapboxgl.accessToken = MAPBOX_API_KEY;

const markers = [];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-71.096081, 42.352554],
  zoom: 13
});

const updateMarkers = (vehicles) => {
  const vehicleData = vehicles.data;

  const len = Math.max(vehicleData.length, markers.length);

  for (let i = 0; i < len; i++) {
    if (!markers[i]) {
      markers[i] = new mapboxgl.Marker()
        .setLngLat([vehicleData[i].attributes.longitude, vehicleData[i].attributes.latitude])
        .addTo(map);
    } else if (i >= vehicleData.length) {
      markers[i].remove();
    } else {
      markers[i].setLngLat([vehicleData[i].attributes.longitude, vehicleData[i].attributes.latitude]);
    }
  }
};

const mbta_url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
const mbta_options = {
  headers: {
    'X-API-Key': MBTA_API_KEY
  }
}
let vehicles = { data: [] };

const getVehicles = async () => {
  
  try {
    const response = await fetch(mbta_url, mbta_options);
    const lastModified = response.headers.get('Last-Modified');
    if (lastModified !== mbta_options.headers['If-Modified-Since']) vehicles = await response.json();
    if (lastModified) mbta_options.headers['If-Modified-Since'] = lastModified;
    return vehicles;
  } catch (error) {
    console.error(`There was a problem getting the bus data from ${mbta_url}`);
    console.error(error);
    return vehicles;
  }
}

const getVehiclesAndUpdateMarkers = () => {
  getVehicles()
    .then(
      (vehicles) => updateMarkers(vehicles)
    )
    .catch((error) => {
      console.error(error);
    });
}

getVehiclesAndUpdateMarkers();

setInterval(() => {
  getVehiclesAndUpdateMarkers();
}, 1500);