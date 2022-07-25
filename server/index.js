const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {Client} = require('pg');
const sql = require('yesql').pg;

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

app.listen(port, ()=> {
    console.log('Server Running on port ' + port);
});

