[![build status](https://secure.travis-ci.org/openmason/wspipe.png)](http://travis-ci.org/openmason/wspipe)
# WebSocket to TCP pipe (wspipe)
Connects WebSocket and TCP (bridge TCP socket over WS).

# Usage
First create a WebSocket Server connection

   var WebSocketServer = require('ws').Server;
   var server = new WebSocketServer({port:80, path:'/mysocket'});

Let wspipe bridge the WS to TCP
  
   var WebSocketPipe = require('wspipe');
   var debug = true;
   var tcpServerHost = 'localhost';
   var tcpServerPort = 3474;
   var wspipe = new WebSocketPipe(server, debug, tcpServerHost, tcpServerPort);
   // thats' it ... all new connections to ws are automatically taken care of


# Examples

## MQTT over WebSocket
To do a MQTT client/WS to WS <--> MQTT Broker, please refer to examples/ws-mqtt.js
