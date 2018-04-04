require("dotenv").config();
//var keys = require("./keys.js");
var request = require("request");


//var spotify = new Spotify(keys.spotify);
//var client = new Twitter(keys.twitter);
//console.log(process.env.TWITTER_CONSUMER_KEY)
var userChoice = process.argv[2];
if (userChoice === "movie-this") {
    var movieName = process.argv[3];
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);
    // Then create a request to the queryUrl
    request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            // Then log the Release Year for the movie
            console.log(JSON.parse(body).Year);
        }
    });

}