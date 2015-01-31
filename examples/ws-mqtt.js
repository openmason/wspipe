var WebSocketServer = require('ws').Server;
var server = new WebSocketServer({port:5080, path:'/mqtt'});

var WebSocketPipe = require('..');
var debug = true;
var tcpServerHost = 'localhost';
var tcpServerPort = 1883;
var wspipe = new WebSocketPipe(server, debug, tcpServerHost, tcpServerPort);
// now ws socker is running on port 5080 which forwards traffic to mqtt sever on localhost

