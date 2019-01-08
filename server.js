const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const Houndify = require('houndify');
const { OAuth2Client } = require('google-auth-library');
const clientID =
  '638905728157-h454ep1gttumk8p2ihqtbudfpnjima1a.apps.googleusercontent.com';
const client = new OAuth2Client(clientID);

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

// Request user dreams
app.get('/api/v1/users/:user_id/user_id', (req, res) => {
  database('users')
    .where('user_id', req.params.user_id)
    .select('user_id')
    .then(userId => {
      database('dreams')
        .where('user_id', userId[0].user_id)
        .select()
        .then(dreams => {
          res.status(200).json(dreams);
        })
        .catch(error => {
          res.status(500).json({ error });
        });
    });
});

// Post new dream
app.post('/api/v1/dreams', (req, res) => {
  let newDream = req.body;
  // for (let requiredParameter of ['date', 'dream']) {
  //   if (!newDream[requiredParameter]) {
  //     return res
  //       .status(422)
  //       .send({ error: `You are missing a ${requiredParameter} property.` });
  //   }
  // }
  database('users')
    .where({ current_user: true })
    .select('user_id')
    .then(userId => {
      database('dreams')
        .insert(
          {
            date: newDream.date,
            dream: newDream.dream,
            user_id: userId[0].user_id
          },
          'dream_id'
        )
        .then(dreamId => {
          res.status(201).json({ dreamId });
        })
        .catch(error => {
          res.status(500).json({ error });
        });
    });
});

//Authorize User
app.post('/api/v1/users/authorize', async (req, res) => {
  let user = req.body;
  const newUser = await verify(user.token);

  for (let requiredParameter of ['user_name', 'user_token']) {
    if (!newUser[requiredParameter]) {
      return res
        .status(422)
        .send({ error: `You are missing a ${requiredParameter} property.` });
    }
  }
  database('users')
    .where('user_token', newUser.user_token)
    .then(response => {
      if (response.length <= 0) {
        return database('users')
          .insert(newUser)
          .then(userId => {
            res.status(201).json(userId);
          })
          .catch(error => {
            res.status(500).json({ error });
          });
      }
      return database('users')
        .select('user_id')
        .where('user_token', newUser.user_token)
        .then(userId => {
          res.status(201).json(userId);
        });
    });
});

//Verification and get userid
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientID
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  const userName = payload['name'];
  return { user_token: userid, user_name: userName };
}
//Login Current User
app.patch('/api/v1/users/:id', (request, response) => {
  database('users')
    .where({ user_id: request.params.id })
    .update({ current_user: true })
    .then(response => {
      response.status(200).send('Logged In!');
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//Logout Current User
app.patch('/api/v1/users', (request, response) => {
  return database('users')
    .where({ current_user: true })
    .update({ current_user: false })
    .then(response => {
      response.status(200).send('Logged Out!');
    })
    .catch(error => {
      response.status(500).json({ error });
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
    console.log(
      `The Dreaming running on https server on port ${app.get('port')}`
    );
  });
} else {
  app.listen(app.get('port'), () => {
    console.log(`The Dreaming running on port ${app.get('port')}`);
  });
}

app.delete('/api/v1/dreams/:id', (request, response) => {
  database('dreams')
    .where({ dream_id: request.params.id })
    .del()
    .then(response => {
      response.status(200).send('deleted');
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});
