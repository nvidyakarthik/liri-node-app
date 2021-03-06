require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var inquirer = require("inquirer");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify)
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var userChoice = process.argv[2];
inquirer
    .prompt([
        //list of choices
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
        },
        // Here we ask the user to confirm.
        {
            type: "confirm",
            message: "Do you want the output sent to a log.txt file?:",
            name: "outputLogConfirm",
            default: false
        },

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
                            movieInformation(inquirerResponse1.movieName,inquirerResponse.outputLogConfirm);
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
                    ]).then(function (inquirerResponse1) {
                        // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
                        if (inquirerResponse1.confirm) {
                            //console.log(inquirerResponse1.songName);
                            songInformation(inquirerResponse1.songName,inquirerResponse.outputLogConfirm);
                        }
                    });
            }
            else if(inquirerResponse.userChoice ==="my-tweets") {
                console.log("Here is the last 20 tweets");
                tweetInformation(inquirerResponse.outputLogConfirm);
            }
            else if(inquirerResponse.userChoice ==="do-what-it-says"){
                console.log("Reading command from random.txt file");
                readFileChoice(inquirerResponse.outputLogConfirm);
            }
        }
    });

//This function uses spotify API to display the song information asked by the user
function songInformation(songName,outputLogConfirm){
    var output="";
    output+="***********************SONG INFORMATION***************************************\n";
    if (songName === ""){
        songName = "All That She Wants";
        output+="You didn't enter any Song name.So we provided a default song information about '"+songName+"'\n";
    }
    spotify
        .search({ type: 'track', query: songName })
        .then(function (response) {
            //console.log(response);
            //console.log();
            if (response.tracks.items[0]) {
                var track = response.tracks.items[0];
                //console.log(JSON.stringify(track,null,2));
               
                for (var i = 0; i < track.artists.length; i++) {
                    output+="Artists Name :" + track.artists[i].name+"\n";
                }
                output+="Songs Name :" + track.name+"\n";
                output+="A preview link of the song from Spotify :" + track.preview_url+"\n";
                output+="The album that the song is from :" + track.album.name+"\n";
                
                if(outputLogConfirm)
                    outputToLogFile(output);
                else
                    console.log(output);    

            }
            else{
                console.log("Please enter the song name correctly");
            }

        })
        .catch(function (err) {

            console.log(err);
        });


} 

//This function uses OMDB API to display movie information asked by the user
function movieInformation(movieName,outputLogConfirm) {
    var output="";
    output+="***************************************MOVIE INFORMATION******************************\n";
    if (movieName === ""){
        movieName = "Mr.Nobody";
        output+="You didn't enter any Movie name.So we provided a default movie information about '"+movieName+"'\n";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    // This line is just to help us debug against the actual URL.
    //console.log(queryUrl);
    
    // Then create a request to the queryUrl
    request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            // Then log the Release Year for the movie
            var jsonBody = JSON.parse(body);
            if(jsonBody.Response!="False"){
            
            output+="Title of the Movie : " + jsonBody.Title+"\n";
            output+="Year of the Movie : " + jsonBody.Year+"\n";
            output+="IMDB Rating of the movie : " + jsonBody.imdbRating+"\n";
            for (var i = 0; i < jsonBody.Ratings.length; i++) {
                if (jsonBody.Ratings[i].Source == "Rotten Tomatoes")
                    output+="Rotten Tomatoes Rating of the movie : " + jsonBody.Ratings[i].Value+"\n";

            }
            output+="Country where the movie was produced : " + jsonBody.Country+"\n";
            output+="Language of the movie : " + jsonBody.Language+"\n";
            output+="Plot of the movie : " + jsonBody.Plot+"\n";
            output+="Actors in the movie : " + jsonBody.Actors+"\n";
            
            if(outputLogConfirm)
                outputToLogFile(output);
            else
                console.log(output);
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

//This function displays the last 20 tweets of my twitter account
function tweetInformation(outputLogConfirm) {
    var params = { screen_name: 'MY2' };
    var output="";
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            //console.log(tweets);
           
            for (var i = 0; i < tweets.length; i++) {  
                output+="**************************TWEET MESSAGES************************************\n";              
                output+="Tweet Message " + (i + 1) + ": " + tweets[i].text+"\n";
                output+="Date Created:" + tweets[i].created_at+"\n";
                
            }
            if(outputLogConfirm)
                outputToLogFile(output);       
            else
                console.log(output);
        }
        else {
            console.log(error);
        }

    });
}

//This function reads command and the random.txt file and displays output accordingly.
function readFileChoice(outputLogConfirm){

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
                tweetInformation(outputLogConfirm);
                break;
            case "spotify-this-song":
                songInformation(songName,outputLogConfirm);
                break;
            case "movie-this":
                movieInformation(movieName,outputLogConfirm);
                break;
            default:
                console.log("Cannot identify the Choice.");

        }


    });

}
function outputToLogFile(output){
    console.log("Output sent to log.txt file.Please check it.")
    fs.appendFile("log.txt",output, function(err) {
        if (err) {
        return console.log(err);
    }
    });

}