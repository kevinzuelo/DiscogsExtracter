var Discogs = require('disconnect').Client;

var myCollection = [];

var col = new Discogs().user().collection();
col.getReleases('kevinzuelo', 0, {page: 0, per_page: 410}, function(err, data){
    for (let index = 0; index < data.releases.length; index++) {
        let album = {title: data.releases[index].basic_information.title, 
            artist: data.releases[index].basic_information.artists[0].name};
        myCollection[index] = album;
    
    }
    myCollection.forEach(element => {
        console.log(element);
    });
    module.exports.myCollection = myCollection;
});











