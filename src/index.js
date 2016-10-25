import express from 'express';
import compression from 'compression';
import healthcheckRoute from './routes/healthcheck';
import bundleRoute from './routes/bundle';
import log from './util/logger';

const app = express();

// Serve static files from ./public/
app.use(express.static('public'));

// compress all responses
app.use(compression());

// Set up routes
healthcheckRoute(app);
bundleRoute(app);

// Start the server
const port = 8080;
app.listen(port, () => {
  log(`Example app listening at http://0.0.0.0:${port} :)`);
});
