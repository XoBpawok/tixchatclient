var remote = require('remote');
var emitter = remote.require('./emitter.js');
var $ = require('jquery');


var local = {
  rooms: [],
  users: {},
  activeRoom: ''
}

emitter.on('client.onmessage', function(data) {
  switch (data[0]) {
    case 'room': {
      switch (data[1].event) {
        case 'state': {
          fillUsers(data[1].users);
          renderRoom(data[1]);
        }; break;
        case 'join': {
          updateRoom(data[1]);
        }; break;
        case 'message': {
          addMessage(data[1]);
        }; break;
      }
    }; break;
  }
});

function fillUsers(users) {
  $.each(users, function(index, item) {
    local.users[index] = item;
  });
}

function renderRoom(data) {
  for (var i = local.rooms.length - 1; i >= 0; i--) {
    if (local.rooms[i].room === data.room) {
      return;
    }
  };
  local.rooms.push(data);

  var $room = $('<div>', {
    class: 'room',
    text: data.data.name
  });

  var $msg = '',
    msg,
    username;

  for (i = 0; i < data.messages.length; i++) {
    msg = data.messages[i];
    username = local.users[msg.user] ? local.users[msg.user].name : 'undefined';
    $msg = $('<div>', {
      html: '<span class="msg-time">' + new Date(msg.time) + '</span> | <span class="msg-author">' + username + '</span>: <span class="msg-text">' + msg.text + '</span>'
    });
    $room.append($msg);
  };

  $('#container').append($room);
}

function updateRoom(data) {

}

function addMessage(data) {

}


$('#send').on('click', function() {
  emitter.emit('client.say', {room: $('#active-room').val(), msg: $('#msg').val()});
});