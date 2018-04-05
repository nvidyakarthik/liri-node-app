require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var fs=require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
//console.log(process.env.TWITTER_CONSUMER_KEY)
var userChoice = process.argv[2];
if (userChoice === "movie-this") {
    var movieName = process.argv[3];
    console.log("movieName :" + movieName);
    if (typeof movieName == 'undefined')
        movieName = "Mr.Nobody";
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);
    // Then create a request to the queryUrl
    request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            // Then log the Release Year for the movie
            var jsonBody = JSON.parse(body);
            console.log("*********************************************************************");
            console.log("Title of the Movie : " + jsonBody.Title);
            console.log("Year of the Movie : " + jsonBody.Year);
            console.log("IMDB Rating of the movie : " + jsonBody.imdbRating);
            for (var i = 0; i < jsonBody.Ratings.length; i++) {
                if (jsonBody.Ratings[i].Source == "Rotten Tomatoes")
                    console.log("Rotten Tomatoes Rating of the movie : " + jsonBody.Ratings[i].Value);

            }
            console.log("Country where the movie was produced : " + jsonBody.Country);
            console.log("Language of the movie : " + jsonBody.Language);
            console.log("Plot of the movie : " + jsonBody.Plot);
            console.log("Actors in the movie : " + jsonBody.Actors);
            console.log("*********************************************************************");

        }
    });

}
if (userChoice === "spotify-this-song") {
    var songName = process.argv[3];
    spotify
        .search({ type: 'track', query: 'Meant to Be' })
        .then(function (response) {
            //console.log(response);
            /* console.log();
            if(response.tracks.items[0]){
                var track=response.tracks.items[0];
                //console.log(JSON.stringify(track,null,2));
                for(var i=0;i<track.artists.length;i++){
                console.log("Artists Name :"+track.artists[i].name);
                }
                console.log("Songs Name :"+track.name);
                console.log("A preview link of the song from Spotify :"+track.preview_url);
                console.log("The album that the song is from :"+track.album.name) ;
        
            }     */
            var trackItems = response.tracks.items;
            for (var i = 0; i < 4; i++) {
                console.log(JSON.stringify(trackItems[i], null, 2));
                // console.log(trackItems[i].album.artists.name);
            }
        })
        .catch(function (err) {

            console.log(err);
        });

}
if (userChoice === "my-tweets") {
    var params = { screen_name: 'MY2' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            //console.log(tweets);
            for (var i = 0; i < tweets.length; i++) {

                console.log("Date Created:" + tweets[i].created_at);
                console.log("Message " + (i + 1) + " " + tweets[i].text);
                console.log("***********************************************************************************");
            }
        }
        else {
            console.log(error);
        }

    });
}
if(userChoice==="do-what-it-says"){
    fs.readFile("random.txt","utf8",function(error,data){
        if(error){
            return console.log(error);
        }
        console.log("contents from file :"+data);
        var dataArr=data.split(",");
        console.log(dataArr);
        var randomTxtChoice=dataArr[i];
        var songName=dataArr[i];
    
        
    });
    
}