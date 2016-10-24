import express from 'express';
import healthcheckRoute from './routes/healthcheck';
import bundleRoute from './routes/bundle';

const app = express();

// Serve static files from ./public/
app.use(express.static('public'));

// Set up routes
healthcheckRoute(app);
bundleRoute(app);

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://0.0.0.0:${port} :)`); // eslint-disable-line no-console
});
