//websocket setup
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var box = [];

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//testing
app.get('/main', function (req, res, next) {
    res.send('Hello World!')
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

io.on('connection', function (client) {
    console.log(client.id);

    // Disconnect listener
    client.on('disconnect', function() {
        console.log(client.id + ' Client disconnected.');
    });
    client.on('testingSocket', function () {
        // console.log('Hello World');
        client.emit('replySocket', "dari server");
    });
    client.on('chatRoom', function (chat, role, box) {
	console.log(client.id+' Send some messages. '+chat);
	if(role == 'admin'){
		var username = role;
	}else {
		var username = role+' - '+client.id;
	}
	var data = {
		userid : username,
		message : chat
	};
	
	box.push(data);
	io.emit('userid', client.id);
        //box += chat + '\n';
        io.emit('replyChat', box);
    });
});
