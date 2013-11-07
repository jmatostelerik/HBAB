var express = require('express');
var fs = require('fs');

var app = express();
var port = 3003;

app.get('*', function(req, res){
	var requestPath = req.params[0] || "",
		path = __dirname +"/"+ requestPath;

	// if the path is invalid and it's missing a slash, add one
	if(!fs.existsSync(path)){
		path = path.charAt(path.length-1) !== "/" ? path + "/" : path;
	}
	// if the path is still invalid, add index.html
	if(!fs.existsSync(path)){
		path += "index.html";
	}
	// if the path is STILL invalid, then tell the user to stop screwing things up!
	if(!fs.existsSync(path)){
		path = null;
	}

	if(path){
		res.sendfile(path);
	} else {
		res.send(404, "<div style='margin-top: 50px; font-size: 10em; font-weight: bold; font-family: arial, sans-serif; text-align: center; line-height: .8em; letter-spacing: -0.1em'>404!NOTFINDED!<br>WHYYOUBORKEDIT<br></div><div style='font-size: 18em; font-weight: bold; font-family: arial, sans-serif; text-align: center; line-height: .8em; letter-spacing: -0.1em'>OMG?!</div>");
	}

});

app.listen(port);

console.log("WEBSERVER LISTENING ON PORT: " + port);