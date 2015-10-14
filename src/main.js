var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var socket = require('./auth.js');
var emitter = require('./emitter.js');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');


  socket.connect('kralo07@rambler.ru', 'monkey').then(function(connection) {
    console.log('#client connected');
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
        //console.log("Received: '" + message.utf8Data + "'");
        emitter.emit('client.onmessage', JSON.parse(message.utf8Data));
      }
    });
    emitter.on('client.say', function(data) {
      console.log(JSON.stringify(data));
      connection.send('["request",{"scope":"room","room":"' + data.room + '","method":"say","params":{"text":"' + data.msg + '"}}]');
    })
    emitter.emit('client.connected');
  });

  // Open the DevTools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});