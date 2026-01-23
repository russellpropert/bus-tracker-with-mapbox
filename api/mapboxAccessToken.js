export default function mapboxAccessToken (req, res) {
  const mapboxToken = process.env.MAPBOX_API_TOKEN;

  if (mapboxToken) {
    res.status(200).json({ mapboxToken });
  } else {
    res.status(500).json({ errorMessage: 'Could not get the MAPBOX_API_TOKEN environment variable in mapboxAccessToken.js. The token value evaluated to false.' });
  }
};
