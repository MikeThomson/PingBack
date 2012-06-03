(function() {
	redis = require('redis');
	request = require('request');
	redisClient = null;
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

	exports.add = function(url, params, callback) {
		console.log('Adding: ' + url);
		redisClient.multi()
			.sadd('test', url)
			.hmset(url, params)
			.exec(callback);
	}

	exports.init = function(config) {
		var port = (typeof config.port != 'undefined') ? null : config.port;
		var host = (typeof config.host != 'undefined') ? null : config.host;
		redisClient = redis.createClient(port, host);
	}

}).call(this);
