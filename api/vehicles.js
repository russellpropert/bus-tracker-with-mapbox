const mbta_url = 'https://api-v3.mbta.com/vehicles?filter[route]=1';
const mbta_options = {
  headers: {
    'X-API-Key': process.env.MBTA_API_KEY
  }
};

let vehicles = { data: [] };

export default async function getVehicles (req, res) {
  try {
    const response = await fetch(mbta_url, mbta_options);
    if (response.ok) {
      const lastModified = response.headers.get('Last-Modified');
      if (lastModified !== mbta_options.headers['If-Modified-Since']) vehicles = await response.json();
      if (lastModified) mbta_options.headers['If-Modified-Since'] = lastModified;
      res.status(200).json({ vehicles });
    } else {
      res.status(response.status).json({ errorMessage: `There was a problem fetching the vehicle data from ${mbta_url}: Status code: ${response.status} ${response.statusText}` });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: `There was an error in getVehicles in vehicles.js: ${error}` });
  }
};
