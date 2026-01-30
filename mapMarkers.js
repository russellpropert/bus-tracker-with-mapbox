import './components/error-message.js';

let map;
const markers = [];

const errorMessageElement = document.querySelector('error-message');

const getMapboxToken = async () => {
  let errorMessageBody = '';
  try {
    const response = await fetch('/api/mapboxAccessToken');
    const responseData = await response.json();
    if (response.ok) {
      return responseData.mapboxToken;
    } else {
      errorMessageBody = `The error was in the response from /api/mapboxAccessToken in getMapboxToken in mapMarkers.js: ${responseData.errorMessage}`;
    }
  } catch (error) {
    errorMessageBody = `There was an error in getMapboxToken in mapMarkers.js: ${error}`;
  }
  const errorMessageHeading = 'The Mapbox Token could not be retrieved.'
  errorMessageElement.displayErrorMessage(errorMessageHeading, errorMessageBody);
  return null;
};

const createMap = (mapboxToken) => {
  if (mapboxToken) {
    return new mapboxgl.Map({
      accessToken: mapboxToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-71.096081, 42.352554],
      zoom: 13
    });
  } else {
    return null;
  }
};

const updateMarkers = (vehicles) => {
  if (markers.length) {
    let markerIndexesToRemove = [];
    markers.forEach((marker, markerIndex) => {
      const vehicleIndex = vehicles.findIndex(vehicle => vehicle.id === marker.id);
      if (vehicleIndex >= 0) {
        const [ vehicle ] = vehicles.splice(vehicleIndex, 1);
        marker.setLngLat([vehicle.attributes.longitude, vehicle.attributes.latitude]);
      } else {
        marker.remove();
        markerIndexesToRemove.unshift(markerIndex);
      }
    });
    markerIndexesToRemove.forEach(index => markers.splice(index, 1));
  }

  if (vehicles.length) {
    vehicles.forEach(vehicle => {
      const newMarker = new mapboxgl.Marker()
        .setLngLat([vehicle.attributes.longitude, vehicle.attributes.latitude])
        .addTo(map);

      newMarker.id = vehicle.id;

      markers.push(newMarker);
    });
  }
};

const getVehicles = async () => {
  let errorMessageBody = '';
  try {
    const response = await fetch('/api/vehicles');
    const responseData = await response.json();
    if (response.ok) {
      errorMessageElement.hideAndResetErrorMessage();
      return responseData.vehicles.data;
    } else {
      errorMessageBody = `The error was in the response from /api/vehicles in getVehicles in mapMarkers.js: ${responseData.errorMessage}`;
    }
  } catch (error) {
    errorMessageBody = `There was an error in getVehicles in mapMarkers.js: ${error}`;
  }
  const errorMessageHeading = 'There was a problem getting the vehicle data for the map markers.';
  errorMessageElement.displayErrorMessage(errorMessageHeading, errorMessageBody);
  return [];
};

const getVehiclesAndUpdateMarkers = () => {
  getVehicles()
    .then(
      (vehicles) => updateMarkers(vehicles)
    )
    .catch((error) => {
      console.error(error);
    });
};

window.addEventListener('load', async () => {
  const mapboxToken = await getMapboxToken();
  map = createMap(mapboxToken);

  if (map) {
    let error = false;

    map.on('error', (event) => {
      error = true;
      const errorMessageHeading = 'The map could not be loaded.';
      const errorMessageBody = `Mapbox error. The map could not be loaded in mapMarkers.js. ${event.error.message}`;

      errorMessageElement.displayErrorMessage(errorMessageHeading, errorMessageBody);
    });

    map.on('load', () => {
      if (!error) {
        getVehiclesAndUpdateMarkers();

        setInterval(() => {
          getVehiclesAndUpdateMarkers();
        }, 1500);
      }
    });
  }
});
