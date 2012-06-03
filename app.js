
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var amqp = require('amqp');  
pinger = require('./pinger');
var app = module.exports = express.createServer();
var nconf = require('nconf');

// Configuration

nconf.argv()
	  .env()
	  .file({ file: 'config.json' });

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

pinger.init(nconf.get('redis'));

var connection = amqp.createConnection(nconf.get('rabbitmq'));
connection.on('ready', function () {
	connection.queue('my-queue', function(q){
		q.bind('#');
		q.subscribe(function (message) {
			// Print messages to stdout
			console.log(message);
			pinger.ping('test', message);
	   });
	});
});

// Routes

app.get('/', pinger.ping);
app.post('/add', routes.add);
app.post('/:wait', pinger.test);
app.listen(3001, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
