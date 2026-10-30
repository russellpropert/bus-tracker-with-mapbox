# Real-Time Bus Tracker
**Live Demo:** [https://boston-bus-tracker-with-mapbox.vercel.app](https://boston-bus-tracker-with-mapbox.vercel.app)

## Description
This project tracks the Route 1 Massachusetts Bay Transportation Authority (MBTA) buses that travel Mass Ave in Boston and Cambridge. The page displays one marker per bus and updates every 1.5 seconds. The bus locations are derived from real-time data pulled from the MBTA API. This began as starter code from MIT xPRO's Full Stack Development with MERN certificate program.

## My Contributions
- Moved the Mapbox token and MBTA API key out of the frontend code and into Vercel serverless functions that read them from environment variables.
- Added an MBTA API key to vehicle requests for higher rate limits than anonymous access.
- Added `If-Modified-Since` caching to the vehicles function, so it only re-parses MBTA data when it has changed.
- Rewrote marker updates to match markers to buses by vehicle ID, so markers no longer jump between buses when the API response order changes.
- Added logic to remove a bus's marker when it leaves the route and add one when a new bus appears.
- Delayed map creation until token retrieval and started polling only after the map loaded without errors.
- Built an `<error-message>` web component (Shadow DOM) that shows on-screen errors when the token fetch, the vehicle fetch, or the map load fails, and hides itself when data loads again.
- Added descriptive error messages throughout the client and serverless code.

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
11. Navigate to the appropriate localhost port in your browser, usually `http://localhost:3000`.

## Future Improvements
- Add some bus icons to replace the generic markers.
- Display the bus numbers above the icons.
- Use [server-sent events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) streaming instead of polling for vehicle updates. See [MBTA V3 API Streaming](https://www.mbta.com/developers/v3-api/streaming).
