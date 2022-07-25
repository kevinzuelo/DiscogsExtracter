const Discogs = require('disconnect').Client;
const {Client} = require('pg');
const sql = require('yesql').pg;

//Setting up db client 

const client = new Client(
    {
        host: "localhost",
        user: "postgres",
        port: "5432",
        password: "postgres1",
        database: "DiscogsAlbums"
    }
);

//Function that inserts album's name and artist into sql queries and into database

function addAlbumToDatabase(album) {
    sqlArtist = "INSERT INTO artist (name) SELECT $1 WHERE NOT EXISTS (SELECT id FROM artist WHERE name = $2);";
    sqlAlbum = "INSERT INTO album (name, artist_id) VALUES ($1, (SELECT id FROM artist WHERE name = $2));";
    title = album.title;
    artist = album.artist;

    client.query(sqlArtist, [artist, artist], (err) => {
        if(err) {
            console.log(err.message);
        }
    });

    client.query(sqlAlbum, [title, artist], (err) => {
        if(err) {
            console.log(err.message);
        }
    });
    
}

//Extracting collection from Discogs and storing into database

client.connect();

let col = new Discogs().user().collection();
col.getReleases('kevinzuelo', 0, {page: 0, per_page: 410}, function(err, data){
    for (let index = 0; index < data.releases.length; index++) {
        let album = {
            title: data.releases[index].basic_information.title, 
            artist: data.releases[index].basic_information.artists[0].name
        };
        addAlbumToDatabase(album);
    }  
});

client.end;