require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var inquirer = require("inquirer");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var userChoice = process.argv[2];
inquirer
    .prompt([
        {
            type: "list",
            message: "Enter your choice?",
            choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "userChoice"
        },

        // Here we ask the user to confirm.
        {
            type: "confirm",
            message: "Are you sure:",
            name: "confirm",
            default: true
        }
    ])
    .then(function (inquirerResponse) {
        // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
        if (inquirerResponse.confirm) {

            console.log(inquirerResponse.userChoice);
            if (inquirerResponse.userChoice === "movie-this") {
                // Create a "Prompt" with a series of questions.
                inquirer
                    .prompt([
                        // Here we create a basic text prompt.
                        {
                            type: "input",
                            message: "Please enter the movie name?",
                            name: "movieName"
                        },
                        // Here we ask the user to confirm.
                        {
                            type: "confirm",
                            message: "Are you sure:",
                            name: "confirm",
                            default: true
                        }
                    ]).then(function (inquirerResponse1) {
                        // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
                        if (inquirerResponse1.confirm) {
                            console.log(inquirerResponse1.movieName);
                            movieInformation(inquirerResponse1.movieName);
                        }
                    });
            }
            else if (inquirerResponse.userChoice ==="spotify-this-song") {
                // Create a "Prompt" with a series of questions.
                inquirer
                    .prompt([
                        // Here we create a basic text prompt.
                        {
                            type: "input",
                            message: "Please enter the song Name?",
                            name: "songName"
                        },
                        // Here we ask the user to confirm.
                        {
                            type: "confirm",
                            message: "Are you sure:",
                            name: "confirm",
                            default: true
                        }
                    ]).then(function (inquirerResponse) {
                        // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
                        if (inquirerResponse.confirm) {
                            console.log(inquirerResponse.songName);
                            songInformation(inquirerResponse.songName);
                        }
                    });
            }
            else if(inquirerResponse.userChoice ==="my-tweets") {
                console.log("Here is the last 20 tweets");
                tweetInformation();
            }
            else if(inquirerResponse.userChoice ==="do-what-it-says"){
                console.log("Reading from random.txt file");
                readFileChoice();
            }
        }
    });

function songInformation(songName){
    spotify
        .search({ type: 'track', query: songName })
        .then(function (response) {
            //console.log(response);
            //console.log();
            if (response.tracks.items[0]) {
                var track = response.tracks.items[0];
                //console.log(JSON.stringify(track,null,2));
                for (var i = 0; i < track.artists.length; i++) {
                    console.log("Artists Name :" + track.artists[i].name);
                }
                console.log("Songs Name :" + track.name);
                console.log("A preview link of the song from Spotify :" + track.preview_url);
                console.log("The album that the song is from :" + track.album.name);

            }
            else{
                console.log("Please enter the song name correctly");
            }

        })
        .catch(function (err) {

            console.log(err);
        });


}    
function movieInformation(movieName) {
    if (movieName == "")
        movieName = "Mr.Nobody";
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    // This line is just to help us debug against the actual URL.
    //console.log(queryUrl);
    console.log("You didn't enter any Movie name.So we provided a default movie information about "+movieName);
    // Then create a request to the queryUrl
    request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            // Then log the Release Year for the movie
            var jsonBody = JSON.parse(body);
            if(jsonBody.Response!="False"){
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
            else{
                console.log(jsonBody.Error);
                console.log("Please Enter a Correct Movie Name");
            }   
        }
        else
          console.log(error);  
    });

}


function tweetInformation() {
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
function readFileChoice(){

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        //console.log("contents from file :" + data);
        var dataArr = data.split(",");
        //console.log(dataArr);
        var randomTxtChoice = dataArr[0];
        var songName = dataArr[1];
        switch(randomTxtChoice){
            case "my-tweets":
                tweetInformation();
                break;
            case "spotify-this-song":
                songInformation(songName);
                break;
            case "movie-this":
                movieInformation(movieName);
                break;
            default:
                console.log("Cannot identify the Choice.");

        }


    });

}