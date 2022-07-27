const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const env = require('dotenv').config();
var request = require('request');
const querystring = require('node:querystring');

const app = express();

const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
  {
    extended: true
  }));

const client = new Client(
  {
    host: "localhost",
    user: "postgres",
    port: "5432",
    password: "postgres1",
    database: "DiscogsAlbums"
  }
);
client.connect();

app.get('/album/', async (req, res) => {
  const id = req.query.id;
  sqlGetTitle = 'SELECT album.name FROM album JOIN artist ON album.artist_id = artist.id WHERE album.id = $1 ';
  sqlGetArtist = 'SELECT artist.name FROM album JOIN artist ON album.artist_id = artist.id WHERE album.id = $1 ';

  const title = await client.query(sqlGetTitle, [id]);
  const artist = await client.query(sqlGetArtist, [id]);

  res.status(200).send(title.rows[0].name + ", " + artist.rows[0].name);

})

app.listen(port, () => {
  console.log('Server Running on port ' + port);
});

//Spotify auth stuff

const client_id = process.env.CLIENTID;
const client_secret = process.env.CLIENTSECRET;
const redirect_uri = 'http://localhost:8080/callback';

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get('/login', function (req, res) {

  const client_id = process.env.CLIENTID;
  const client_secret = process.env.CLIENTSECRET;
  const state = generateRandomString(16);
  const stateKey = 'spotify_auth_state';
  const scope = 'user-read-private user-read-email';

  res.cookie(stateKey, state)

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      client_secret: client_secret,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        'access_token': access_token,
      });
    }
  })
});

