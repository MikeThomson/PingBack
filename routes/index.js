
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.add = function(req, res) {
	pinger.add(req.body.url, req.body.callbackParams, function(result) {
		res.json(result);
	});
};
