export default function (app) {
  app.get('/healthcheck', (req, res) => {
    res.send('OK');
  });
}
