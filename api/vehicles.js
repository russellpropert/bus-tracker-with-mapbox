const mbta_url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
const mbta_options = {
  headers: {
    'X-API-Key': process.env.MBTA_API_KEY
  }
}

let vehicles = { data: [] };

const getVehicles = async (req, res) => {
  try {
    const response = await fetch(mbta_url, mbta_options);
    const lastModified = response.headers.get('Last-Modified');
    if (lastModified !== mbta_options.headers['If-Modified-Since']) vehicles = await response.json();
    if (lastModified) mbta_options.headers['If-Modified-Since'] = lastModified;
    console.log(vehicles);
    res.status(200).json(vehicles);
  } catch (error) {
    const errorResponseObject = {
      errorMessage: `There was a problem getting the bus data from ${mbta_url}`,
      error: error
    }
    res.status(500).json(errorResponseObject);
  }
}

export default getVehicles;