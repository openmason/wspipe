/**
 * wspipe - main file
 * copyright (c) 2015 openmason.
 * MIT Licensed.
 */
var logger = require('util');
var net = require('net');

var _TO_TCP   = '--> ';
var _FROM_TCP = '<-- ';
var _TARGET = '<-> ';

// WebSocket Pipe library entry point
var WebSocketPipe = function(wsServer, debug, tcpHost, tcpPort) {
  this.debug = debug || false;
  this.wsPath = wsServer.path || '/';
  this.tcpHost = tcpHost || 'localhost'; 
  this.tcpPort = tcpPort; 
  log(this.debug, this.wsPath, _TARGET, this.tcpHost+':'+this.tcpPort);
  // start handling new connections
  var self = this;
  wsServer.on('connection', function(webSocket) {
    log(self.debug, self.wsPath, 'new ', webSocket.protocol);
    var target = _newTcpClient(self, webSocket);
    webSocket.on('message', function(msg) {
      log(self.debug, self.wsPath, _TO_TCP, msg.toString('hex',0,32) + ' ' + msg.toString('ascii',0,32));
      if (webSocket.protocol === 'base64') {
          target.write(new Buffer(msg, 'base64'));
      } else {
          target.write(msg,'binary');
      }
    });
    webSocket.on('close', function(code, reason) {
      log(self.debug, self.wsPath, _TARGET, "ws disconnected: "+code+'['+reason+']');
      target.end();
    });
    webSocket.on('error', function(a) {
      log(self.debug, self.wsPath, _TARGET, "ws error: "+a);
      target.end();
    });
  });
};

// ---- private functions

function _newTcpClient(self, webSocket) {
  var tcpClient = new net.Socket();
  tcpClient.setKeepAlive(true);
  tcpClient.connect(self.tcpPort, self.tcpHost, function() {
    log(self.debug, self.wsPath, _TARGET, 'connected');
  });
  tcpClient.on('data', function(data) {
    log(self.debug, self.wsPath, _FROM_TCP, data.toString('hex',0,32) + ' ' +data.toString('ascii',0,32));
    try {
      if (webSocket.protocol === 'base64') {
        webSocket.send(new Buffer(data).toString('base64'));
      } else {
        webSocket.send(data,{binary: true});
      }
    } catch (e) {
      log(self.debug, self.wsPath, _TARGET, "ws exception, closing tcp session");
      tcpClient.end();
    }
  });
  tcpClient.on('end', function() {
      log(self.debug, self.wsPath, _TARGET, "tcp disconnected");
      webSocket.close();
  });
  tcpClient.on('error', function() {
      log(self.debug, self.wsPath, _TARGET, "tcp connection error");
      tcpClient.end();
      webSocket.close();
  });
  return tcpClient;
};

// debug request/response statements
function log(debug, path, prefix, value) {
  if(debug) {
    logger.debug('wsp['+path+'] '+prefix + value.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, ''));
  }
};

module.exports = WebSocketPipe;

// -- EOF
