import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import healthcheckRoute from './routes/healthcheck';
import bundleRoute from './routes/bundle';
import log from './util/logger';

const app = express();

// Serve static files from ./public/
app.use(express.static('public'));

// Log status codes and URLs
app.use(morgan('EXPRESS method=:method status=:status resptime=:response-time url=:url'));

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
