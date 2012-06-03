var amqp = require('amqp');
var connection = amqp.createConnection({ host: 'localhost' });

connection.on('ready', function() {
	connection.publish('my-queue', {'body' : 'test message 2'});
	console.log('published');
});
