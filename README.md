# Real-Time Bus Tracker
**Live Demo:** [https://boston-bus-tracker-with-mapbox.vercel.app](https://boston-bus-tracker-with-mapbox.vercel.app)

## Description
This project tracks the Route 1 Massachusetts Bay Transportation Authority (MBTA) buses that travel Mass Ave in Boston and Cambridge. The page displays one marker per bus and updates every 15 seconds. The bus locations are derived from real-time data pulled from the MBTA API. Vercel is used for its serverless functions feature, which enables storage of API keys in environment variables to keep them out of the frontend code.

## How To Run
1. Clone this repository to your machine.
2. Create a [Mapbox](https://www.mapbox.com) account or sign in.
3. Create a token for this project. The token is public. Provide a URL if you want to implement URL restrictions.
4. Create an [MBTA developer](https://api-v3.mbta.com) account or sign in.
5. Request a new key for this project.
6. Create a `.env` file in the root directory of this project using `.env.example` as a template.
7. Replace `your-mapbox-api-token-goes-here` and `your-mbta-api-key-goes-here` with your respective API keys.
8. Install [Node.js](https://nodejs.org) if you don't have it already.
9. Run `npm install -g vercel` to globally install Vercel.
10. Run `vercel dev` and answer the prompts.
11. Navigate to the appropriate localhost port in your browser.

## Future Improvements
- Add some bus icons to replace the generic markers.
- Display the bus numbers above the icons.
