require("dotenv").config();
//var keys = require("./keys.js");
var request = require("request");


//var spotify = new Spotify(keys.spotify);
//var client = new Twitter(keys.twitter);
//console.log(process.env.TWITTER_CONSUMER_KEY)
var userChoice = process.argv[2];
if (userChoice === "movie-this") {
    var movieName = process.argv[3];
    console.log("movieName :"+movieName);
    if(typeof movieName=='undefined')
        movieName="Mr.Nobody";
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);
    // Then create a request to the queryUrl
    request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            // Then log the Release Year for the movie
            var jsonBody=JSON.parse(body);
            console.log("*********************************************************************");
            console.log("Title of the Movie : "+jsonBody.Title);
            console.log("Year of the Movie : "+jsonBody.Year);
            console.log("IMDB Rating of the movie : "+jsonBody.imdbRating);
            for(var i=0;i<jsonBody.Ratings.length;i++){
                if(jsonBody.Ratings[i].Source=="Rotten Tomatoes")
                    console.log("Rotten Tomatoes Rating of the movie : "+jsonBody.Ratings[i].Value);
                    
            }
            console.log("Country where the movie was produced : "+jsonBody.Country);
            console.log("Language of the movie : "+jsonBody.Language);
            console.log("Plot of the movie : "+jsonBody.Plot);
            console.log("Actors in the movie : "+jsonBody.Actors);
            console.log("*********************************************************************");
           
        }
    });

}