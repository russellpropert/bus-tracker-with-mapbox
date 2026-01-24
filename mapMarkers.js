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

const mapboxToken = await getMapboxToken();

const createMap = () => {
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

const map = createMap();

const markers = [];

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

const noVehicles = [];

const getVehicles = async () => {
  try {
    const response = await fetch('/api/vehicles');
    const responseData = await response.json();
    if (response.ok) {
      return responseData.vehicles.data;
    } else {
      console.error(`There was a problem with the response from /api/vehicles in getVehicles in mapMarkers.js: ${responseData.errorMessage}`);
    }
  } catch (error) {
    console.error(`There was an error in getVehicles in mapMarkers.js: ${error}`);
  }
  return noVehicles;
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

if (map) {
  map.on('error', (event) => {
    console.error(`Mapbox error. The map could not be loaded. mapMarkers.js: ${event.error}`);
  });

  map.on('idle', () => {
    getVehiclesAndUpdateMarkers();
    
    setInterval(() => {
      getVehiclesAndUpdateMarkers();
    }, 1500);
  });
}