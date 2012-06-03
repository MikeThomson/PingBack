(function() {
	redis = require('redis');
	redisClient = redis.createClient();
	request = require('request');
	exports.ping = function(set, data) {
		console.log(data.params);
		// First tget the whole set 
		redisClient.smembers(set, function(err, replies) {
			replies.forEach(function(reply, index) {
				redisClient.hgetall(reply, function(err, obj) {
					obj.data = data;
					console.log(obj);
					request.post({url : reply, json : obj, jar : false}, function(err, response, body) {
						console.log(reply + ' Sent me:');
						console.log(body);	
					});
				});
			});
		});
	}

	exports.test = function(req, res) {
		setTimeout(function() {res.send(req.body);}, 1000*req.params.wait);
	}

}).call(this);
