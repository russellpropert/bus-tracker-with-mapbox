let map;
const markers = [];

const errorMessageElement = document.querySelector('#error-message');
const errorMessageHeadingElement = document.querySelector('#error-message-heading');
const errorMessageBodyElement = document.querySelector('#error-message-body');

const displayErrorMessage = (errorMessageHeading, errorMessageBody) => { 
  if (!errorMessageElement.classList.contains('visible')) errorMessageElement.classList.add('visible');
  if (errorMessageHeadingElement.innerHTML !== errorMessageHeading) errorMessageHeadingElement.innerText = errorMessageHeading;
  if (errorMessageBodyElement.innerHTML !== errorMessageBody) errorMessageBodyElement.innerText = errorMessageBody;
  
  console.error(errorMessageBody);
};

const resetErrorMessage = () => {
   if (errorMessageElement.classList.contains('visible')) {
    errorMessageElement.classList.remove('visible');
    errorMessageHeadingElement.innerText = '';
    errorMessageBodyElement.innerText = '';
  }
};

const getMapboxToken = async () => {
  try {
    const response = await fetch('/api/mapboxAccessToken');
    const responseData = await response.json();
    if (response.ok) {
      return responseData.mapboxToken;
    } else {
      console.error(`There was a problem with the response from /api/mapboxAccessToken in getMapboxToken in mapMarkers.js: ${responseData.errorMessage}`);
    }
  } catch (error) {
    console.error(`There was a problem fetching the Mapbox token from mapboxAccessToken.js: ${error}`);
  }
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
  let errorMessageBody = null;
  try {
    const response = await fetch('/api/vehicles');
    const responseData = await response.json();
    if (response.ok) {
      resetErrorMessage();
      return responseData.vehicles.data;
    } else {
      errorMessageBody = `There was a problem with the response from /api/vehicles in getVehicles in mapMarkers.js: ${responseData.errorMessage}`;
    }
  } catch (error) {
    errorMessageBody = `There was an error in getVehicles in mapMarkers.js: ${error}`;
  }
  const errorMessageHeading = 'There was a problem getting the vehicle data for the map markers.';
  displayErrorMessage(errorMessageHeading, errorMessageBody);
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
    
        displayErrorMessage(errorMessageHeading, errorMessageBody);
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
