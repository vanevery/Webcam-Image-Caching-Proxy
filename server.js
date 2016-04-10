var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');

var latestImages = [];

function getFile(num) {
	//var request = http.get("http://128.122.151.182:804" + num + "/html/cam_pic.php", 
	//http://192.168.11.146/jpg/image.jpg
	//var request = http.get("http://192.168.11.146/jpg/image.jpg", 
	var request = http.get("http://localhost:8080/static/test.jpg", 
		function(response) {
			var filename = "static/cam" + num + "_" + Date.now() + ".jpg";
			var file = fs.createWriteStream(filename);
  			response.pipe(file);
  			var previousImage = latestImages[num];
			latestImages[num] = filename;
			if (previousImage) {
				fs.unlink(previousImage, null);
			}
			console.log("Save: " + latestImages[num]);
			
			setTimeout(function() { getFile(num); }, 100);
	});
}

getFile(0);
//getFile(1);
//getFile(2);
//getFile(3);

var options = {
    root: __dirname + '/static/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
 
app.get('/', function (req, resp) {
	var num = req.query.i;
	resp.redirect(302,latestImages[num]);
	/*resp.sendFile(latestImages[num], options, function (err) {

    if (err) {
      console.log(err);
      resp.status(err.status).end();
    }
    else {
      console.log('Sent:', latestImages[num]);
    }
  });*/
});

app.use('/static', express.static('static'));

app.listen(8080);
