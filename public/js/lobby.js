var socket = io();
var params = "";
//When player connects to server
socket.on('connect', function() {
    
    params = jQuery.deparam(window.location.search); //Gets data from url
    //Tell server that it is player connection
    socket.emit('player-join', params);
    
});

//Boot player back to join screen if game pin has no match
socket.on('noGameFound', function(){
    var cachedData = localStorage.getItem('playerCache');
    if (cachedData) {
        var path = 'http://192.168.0.13/' + encodeURIComponent(cachedData);
        window.location.href = path;
      } else {
        console.log('Cache is not saved. Unable to redirect.');
      }
});
//If the host disconnects, then the player is booted to main screen
socket.on('hostDisconnect', function(){
    var cachedData = localStorage.getItem('playerCache');
    if (cachedData) {
        var path = 'http://192.168.0.13/' + encodeURIComponent(cachedData);
        window.location.href = path;
      } else {
        console.log('Cache is not saved. Unable to redirect.');
      }
});

//When the host clicks start game, the player screen changes
socket.on('gameStartedPlayer', function(){
    window.location.href="/player/game/" + "?id=" + socket.id + "&name=" + params.name;
});


