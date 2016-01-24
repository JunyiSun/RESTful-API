// Run using:
// >> node app.js 
// Open browser url to : http://127.0.0.1:3000
//----------------------------------------------------------------------------------------------
var fs = require('fs'); // for reading .json files
var http = require('http');
// Read the json file into memory 
var favsJson = JSON.parse(fs.readFileSync('favs.json', 'utf8'));
//----------------------------------------------------------------------------------------------
// Returns thie main home page at beginning 
function homePage(req, res, htmlPage) {
	res.writeHead(200,{ "Content-Type" : "text/html"}); 
	res.write(htmlPage); 
	res.end();  // end response so browser wont wait for server anymore
}

// To get all URLs
function getAllUrls(req, res) {
    var allUrlsJson= []; // initialize list of return objects
    for(var i = 0; i < favsJson.length; i++) 
    {
        currUrl = favsJson[i].entities.urls; 
        // each tweet may contain multiple urls from favs.json
        for(var j = 0; j < currUrl.length; j++)
        {
            // push as a json object
            // For each tweet url, get display_url as Json
            currSpecificUrl = currUrl[j];
            allUrlsJson.push({"url": { "display_url": currSpecificUrl.display_url, "expanded_url": currSpecificUrl.expanded_url}});
        }
    }
    // Write 200 to be status code, and send html directly
	res.writeHead(200,{ "Content-Type" : "application/json"}); 
    // Write anything you want, can write as many as possible
	res.write(JSON.stringify(allUrlsJson)); 
	res.end();  // end response so browser wont wait for server anymore
}

// Returns list of [userId, userScreenName, userDisplayName]
function getAllUsers(req, res) {
    var allUsersJson= []; // initialize list of return objects
    // Each tweet only contains a single user from favs.json
    for(var i = 0; i < favsJson.length; i++) 
    {
        var userDoesntExistYet = true;
        // Check no duplicates before inserting
        for(var j = i + 1; j < favsJson.length; j++)
        {
            if(favsJson[i].user == favsJson[j].user)
            {
                userDoesntExistYet = false;
            }
        }
        // Only push if not a duplicate
        if(userDoesntExistYet)
        {
            // For each user, get userId, screenName, name as Json
            currUser = favsJson[i].user;
            allUsersJson.push({"user": { "id": currUser.id, "screen_name": currUser.screen_name, "name": currUser.name}});
        }
    }
    // Write 200 to be status code, and send html directly
	res.writeHead(200,{ "Content-Type" : "application/json"}); 
    // Write anything you want, can write as many as possible
	res.write(JSON.stringify(allUsersJson)); 
	res.end();  // end response so browser wont wait for server anymore
}

function getUserHandle(req, res, usrHandle) {
    var specificUserJson; // initialize specificUserJson
    // Each tweet only contains a single user from favs.json
    for(var i = 0; i < favsJson.length; i++) 
    {
        // For each user, get userId, screenName, name
        currUser = favsJson[i].user;
        if(currUser.screen_name == usrHandle) {
            // Add to list of all users only if current userId matches usrHandle
            specificUserJson = {"user": {"id": currUser.id, "screen_name": currUser.screen_name, "name": currUser.name}};
            break;
        }
    }
    // Write 200 to be status code, and send html directly
	res.writeHead(200,{ "Content-Type" : "application/json"}); 
    // Write anything you want, can write as many as possible
	res.write(JSON.stringify(specificUserJson)); 
	res.end();  // end response so browser wont wait for server anymore
}

// Returns list of [tweetId, dateCreated, text]
function getAllTweets(req, res) {
    var allTweetsJson = []; // initialize list of return objects
    // Each tweet only contains a single tweet from favs.json
    for(var i = 0; i < favsJson.length; i++) 
    {
        currTweet = favsJson[i];
        // For each tweet, get tweetId, created_at, text as Json
        allTweetsJson.push({"tweet": {"id": currTweet.id, "created_at": currTweet.created_at, "text": currTweet.text}});
    }
    // Write 200 to be status code, and send html directly
	res.writeHead(200,{ "Content-Type" : "application/json"}); 
    // Write anything you want, can write as many as possible
	res.write(JSON.stringify(allTweetsJson)); 
	res.end();  // end response so browser wont wait for server anymore

}

// Returns the tweet for a given TweetId
function getTweetId(req, res, tweetId) {
    var specificTweetJson; // initialize specificTweet to return
    // Each tweet only contains a single tweet from favs.json
    for(var i = 0; i < favsJson.length; i++) 
    {
        currTweet = favsJson[i];
        // Append tweet, tweetId, user
        if(currTweet.id == tweetId) {
            // Get tweetId, created_at, text as Json
            specificTweetJson = {"tweet": {"id": currTweet.id, "created_at": currTweet.created_at, "text": currTweet.text}};
            break;
        }
    }
    // Write 200 to be status code, and send html directly
	res.writeHead(200,{ "Content-Type" : "application/json"}); 
    // Write anything you want, can write as many as possible
	res.write(JSON.stringify(specificTweetJson)); 
	res.end();  // end response so browser wont wait for server anymore
}

// Return the tweets for a given user's screen_name
function getUserTweets(req, res, usrHandle) {
    var specificUserAllTweetsJson = [];
    // Each tweet only contains a single user from favs.json
    for(var i = 0; i < favsJson.length; i++) 
    {
        var specificUserTweetJson;
        // Get the user information and all the tweets that belong to this user
        currTweet = favsJson[i];
        currUser = currTweet.user;
        if(currUser.screen_name == usrHandle) {
            // Add to list of all users only if current userId matches usrHandle
            specificUserTweetJson = {"userTweet": {"user": {"id": currUser.id, "screen_name": currUser.screen_name, "name": currUser.name}, 
                "tweet": {"id": currTweet.id, "created_at": currTweet.created_at, "text": currTweet.text}}};
            specificUserAllTweetsJson.push(specificUserTweetJson);
        }
    }
    // Write 200 to be status code, and send html directly
	res.writeHead(200,{ "Content-Type" : "application/json"}); 
    // Write anything you want, can write as many as possible
	res.write(JSON.stringify(specificUserAllTweetsJson)); 
	res.end();  // end response so browser wont wait for server anymore
}

// Returns an error message on webpage if any errorneous url is requested
function error404(req, res) {
    // Write 200 to be status code, and send html directly
	res.writeHead(404, "Resource Not Found", { "Content-Type" : "text/html"}); 
    // Write anything you want, can write as many as possible
	res.write("<p> 404: Resource Not Found </p>"); 
	res.end();  // end response so browser wont wait for server anymore
}

// Returns an error message if a Http request such as DELETE, CREATE, POST is requested since it's not supported for this assignment
function error405(req, res) {
    // Write 200 to be status code, and send html directly
	response.writeHead(405, "Method Not Supported", { "Content-Type" : "text/html"}); 
    // Write anything you want, can write as many as possible
	response.write("<p> 404: Resource Not Found </p>"); 
	response.end();  // end response so browser wont wait for server anymore
}

// Code to start the server
http.createServer(function (request, response) {
    var parts = request.url.split("/"); // split url on '/'
    var first = parts[0]; 
    console.log(request.url);
    switch(request.method) {
        case "GET":
            // If request for home page, return index.html
            if (request.url == "/") {
                fs.readFile('index.html', function(err, data) {
                    homePage(request, response,data);
                });
            }
            else if ((request.url == "/tweets/") || (request.url == "/tweets")) {
                console.log("Get all tweets");
                getAllTweets(request, response);
            }
            else if (parts[1] == "tweets") {
                console.log("Get tweetId");
                console.log(parts[2]);
                getTweetId(request, response, parts[2]);
            }
            else if ((request.url == "/users/") || (request.url == "/users")) {
                console.log("Get all users");
                getAllUsers(request, response);
            }
            else if(parts[1] == "users") {
                console.log("Get userHandle");
                console.log(parts[2]);
                getUserHandle(request, response, parts[2]);
            }
            else if ((request.url == "/links/") || (request.url == "/links")) {
                console.log("Get external urls");
                getAllUrls(request, response);
            }
            // Ability to extract interesting information
            else if (parts[1] =="userTweets") {
                console.log("Get all tweets from a given user");
                console.log(parts[2]);
                getUserTweets(request, response, parts[2]);
            }
            // Sends the local jquery file
            else if (parts[1] =="jquery.min.js") {
                fs.readFile('jquery.min.js', function(err, data) {
                    response.end(data);
                });
            }
            else {
                console.log("Error: No such REST api");
                error404(request,response);
            }
            break;
        // No POST, PUT, DELETE for this assignment
        default:
            console.log("Error: Method not supported");
            error405(request,response);
            break;
    }
}).listen(3000, "127.0.0.1"); 
console.log("Server started at port 3000, access using http://127.0.0.1:3000");
