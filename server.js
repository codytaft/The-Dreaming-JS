const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const Houndify = require('houndify');
require('dotenv').config();

//knex
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

//parse arguments
const argv = require('minimist')(process.argv.slice(2));

//config file
const configFile = argv.config || 'config';
const config = require(path.join(__dirname, configFile));

//express app
const app = express();
const publicFolder = argv.public || 'public';
app.use(express.static(path.join(__dirname, publicFolder)));
app.use(bodyParser.json());
app.use(cors());
app.set('port', process.env.PORT || 3446);

//authenticates requests
app.get(
  '/houndifyAuth',
  Houndify.HoundifyExpress.createAuthenticationHandler({
    clientId: config.clientId,
    clientKey: config.clientKey
  })
);

//sends the request to Houndify backend with authentication headers
app.post(
  '/textSearchProxy',
  bodyParser.text({ limit: '1mb' }),
  Houndify.HoundifyExpress.createTextProxyHandler()
);

//dreams requests

// Request all dreams
app.get('/api/v1/dreams', (req, res) => {
  database('dreams')
    .select()
    .then(dreams => {
      res.status(200).json(dreams);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

// Post new dream
app.post('/api/v1/dreams', (req, res) => {
  let newDream = req.body;
  for (let requiredParameter of ['date', 'dream']) {
    if (!newDream[requiredParameter]) {
      return res
        .status(422)
        .send({ error: `You are missing a ${requiredParameter} property.` });
    }
  }
  database('dreams')
    .insert(newDream, 'id')
    .then(dreamId => {
      res.status(201).json({ dreamId });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

//start http or https server
if (config.https) {
  //ssl credentials
  var privateKey = fs.readFileSync(config.sslKeyFile);
  var certificate = fs.readFileSync(config.sslCrtFile);
  var credentials = { key: privateKey, cert: certificate };

  //https server
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(app.get('port'), () => {
    console.log('The Dreaming running on port', port);
  });
} else {
  app.listen(app.get('port'), () => {
    console.log(`The Dreaming running on port ${app.get('port')}`);
  });
}
