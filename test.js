
var request = require('request'); 
var obj = {url : 'http://localhost:3001/add',
		json : {url : 'http://bluetempest.net/2', callbackParams : { test1 : 'hi', test2 : 123 }}};	
request.post(obj, function(a, b, body) {console.log(body);});
