var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    port    = process.env.PORT || 5000;


app.configure(function() {
    app.use(express.static(__dirname + '/app'));
});


app.get('/', function(request, response) {
    response.sendFile('index.html');
});


server.listen(port, function() {
    console.log('Listening on ' + port);
});
