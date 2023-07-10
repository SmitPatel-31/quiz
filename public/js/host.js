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
    console.log(data);
    for(var i = 0; i < data.length; i++){
        // document.getElementById('players').value += data[i].name + "\n";
        if(data[i].name=="Player1"){
            document.getElementById('player1').classList.add('active');
        }
        else if(data[i].name =='Player2'){
            document.getElementById('player2').classList.add('active');
        }
        else if(data[i].name=='Player3'){
            document.getElementById('player3').classList.add('active');
        }
        
    }
    document.getElementById('countdown-container').style.display="flex";
   
    startCountdown(5); // Change the value to the desired duration in seconds
});

// Start the countdown and display the remaining seconds


// Update the countdown display
// Update the countdown display
// Update the countdown display
// Update the countdown display
// Update the countdown display
// Update the countdown display
// Update the countdown display
function updateCountdown() {

    // Draw the countdown circle
    var canvas = document.getElementById('countdown-canvas');
    var context = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 90;
    var startAngle = Math.PI * 1.5; // Start at the top
    var endAngle = startAngle - (2 * Math.PI * (remainingSeconds / 5)); // Calculate the end angle based on remaining seconds
    var anticlockwise = false;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the countdown circle
    context.beginPath();
    context.arc(centerX, centerY, radius, startAngle, endAngle, anticlockwise);

    // Create a gradient fill
    var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'green'); // Start color (red)
    gradient.addColorStop(1, 'green'); // End color (yellow)

    // Apply the gradient fill to the countdown circle
    context.lineWidth = 10;
    context.strokeStyle = gradient;
    context.stroke();

    // Draw the countdown text
    context.font = 'bold 50px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(Math.ceil(remainingSeconds), centerX, centerY);
}


// Start the countdown and display the remaining seconds
function startCountdown(duration) {
    remainingSeconds = duration;
    remainingS=duration;
    updateCountdown(); // Initial display

    var countdownInterval = 10; // Update every 10 milliseconds

    countdownTimer = setInterval(function () {
        remainingSeconds -= countdownInterval / 1000; // Decrement by countdown interval in seconds
        updateCountdown();

        if (remainingSeconds <= 0) {
            clearInterval(countdownTimer);
            startGame();
        }
    }, countdownInterval);
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
