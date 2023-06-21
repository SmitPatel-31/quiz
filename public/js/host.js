var socket = io();
var params = jQuery.deparam(window.location.search);
var countdownTimer; // Countdown timer variable
var remainingSeconds; // Remaining seconds

// When host connects to the server
socket.on('connect', function() {
    document.getElementById('players').value = "";

    // Tell the server that it is a host connection
    socket.emit('host-join', params);
});

socket.on('showGamePin', function(data){
    document.getElementById('gamePinText').innerHTML = data.pin;
});

// Adds players' names to the screen and updates the player count
socket.on('updatePlayerLobby', function(data){
    document.getElementById('players').value = "";

    for(var i = 0; i < data.length; i++){
        document.getElementById('players').value += data[i].name + "\n";
    }

    // Start the countdown after a specified duration
    startCountdown(5); // Change the value to the desired duration in seconds
});

// Start the countdown and display the remaining seconds
function startCountdown(duration) {
    remainingSeconds = duration;
    updateCountdown(); // Initial display

    countdownTimer = setInterval(function() {
        remainingSeconds--;
        updateCountdown();

        if (remainingSeconds <= 0) {
            clearInterval(countdownTimer);
            startGame();
        }
    }, 1000); // Update every second
}

// Update the countdown display
function updateCountdown() {
    var countdownElement = document.getElementById('countdown');
    countdownElement.innerHTML = 'Game starts in ' + remainingSeconds + ' seconds';
}

// Tell the server to start the game
function startGame() {
    socket.emit('startGame');
}

function endGame() {
    window.location.href = "/";
}

// When the server starts the game
socket.on('gameStarted', function(id) {
    console.log('Game Started!');
    window.location.href = "/host/game/" + "?id=" + id;
});

socket.on('noGameFound', function() {
    window.location.href = '../../'; // Redirect the user to the 'join game' page
});
