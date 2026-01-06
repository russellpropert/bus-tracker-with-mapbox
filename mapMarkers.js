import { MAPBOX_API_KEY, MBTA_API_KEY } from './config.js';

mapboxgl.accessToken = MAPBOX_API_KEY;

const markers = [];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-71.096081, 42.352554],
  zoom: 13
});

const updateMarkers = (data) => {
  data = data.data;

  const len = Math.max(data.length, markers.length);

  for (let i = 0; i < len; i++) {
    if (!markers[i]) {
      markers[i] = new mapboxgl.Marker()
        .setLngLat([data[i].attributes.longitude, data[i].attributes.latitude])
        .addTo(map);
    } else if (i >= data.length) {
      markers[i].remove();
    } else {
      markers[i].setLngLat([data[i].attributes.longitude, data[i].attributes.latitude]);
    }
  }
};

let mbtaLastModified = null;
const mbta_url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
const mbta_options = {
  headers: {
    'X-API-Key': MBTA_API_KEY,
    'If-Modified-Since': mbtaLastModified
  }
}

const getBuses = async () => {
  try {
    const response = await fetch(mbta_url, mbta_options);
    mbtaLastModified = response.headers.get('Last-Modified');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`There was a problem getting the bus data from ${url}`);
  }
}

getBuses()
  .then((data) => updateMarkers(data))
  .catch((error) => {
    console.error(error);
  });

setInterval(() => {
  getBuses()
    .then((data) => updateMarkers(data))
    .catch((error) => {
      console.error(error);
    });
}, 1000);