import { MAPBOX_API_KEY } from './config.js';

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

const noVehicles = { data: [] };

const getVehicles = async () => {
  try {
    const response = await fetch('/api/vehicles');
    const responseData = await response.json();
    if (response.ok) {
      return responseData;
    } else {
      console.error(responseData.errorMessage);
      console.error(responseData.error);
    }
  } catch (error) {
    console.error(error);
  }
  return noVehicles;
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

// setInterval(() => {
//   getVehiclesAndUpdateMarkers();
// }, 1500);