var secrets = require('../config/secrets');
var request = require('request');

exports.redirect = function(req, res) {
		var notFoundCallback = function() {
			res.status(404).send('Not found');
			// res.end();
		};

		var fingerprint = req.query.fp;
		// cookieHash['Content-Type'] = 'text/plain' // append any other headers you want
		// res.writeHead(200, cookieHash);

		var url = secrets.lambda.endPoint + '/shorten';
		url += "?id=" + (req.query.id ? req.query.id : "") + "&fingerprint=" + (fingerprint ? fingerprint : "");
		console.log("Request Url:" + url);
		var options = {
				method: 'GET',
				url: url,
				headers: {
						'Content-Type': 'application/json'
				}
		};

		request(options, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				console.log("redirect to " + JSON.parse(body).longUrl) // Show the HTML for the Google homepage.
				res.redirect(302, JSON.parse(body).longUrl);
				// res.writeHead(302, {
				// 	'Location': body.longUrl
				// 	//add other headers here...
				// });
				console.log('requset from ' + req.connection.remoteAddress + ', fingerprint -> ' + fingerprint);
				// res.end(resp);
			} else {
				notFoundCallback();
			}
		});
};
