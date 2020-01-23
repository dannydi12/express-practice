const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.listen(8080, () => {
  console.log('listening on 8080')
});

app.get('/api/hello', (req, res) => {
  const text = {
    url: req.baseUrl,
    host: req.hostname,
    path: req.path,
    query: req.query
  }
  return res.status(200).send(text);
})