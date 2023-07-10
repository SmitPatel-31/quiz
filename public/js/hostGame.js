var socket = io();

var params = jQuery.deparam(window.location.search); //Gets the id from url

var timer;

var time = 20;

//When host connects to server
socket.on('connect', function() {
    
    //Tell server that it is host connection from game view
    socket.emit('host-join-game', params);
});

socket.on('noGameFound', function(){
   window.location.href = '../../';//Redirect user to 'join game' page
});

socket.on('gameQuestions', function(data){
    document.getElementById('question').innerHTML = data.q1;
    document.getElementById('answer1').innerHTML = data.a1;
    document.getElementById('answer2').innerHTML = data.a2;
    document.getElementById('answer3').innerHTML = data.a3;
    document.getElementById('answer4').innerHTML = data.a4;
    var correctAnswer = data.correct;
    document.getElementById('playersAnswered').innerHTML = "Players Answered 0 / " + data.playersInGame;
    updateTimer();
    startCountdown(20);
});

socket.on('updatePlayersAnswered', function(data){
   document.getElementById('playersAnswered').innerHTML = "Players Answered " + data.playersAnswered + " / " + data.playersInGame; 
});

socket.on('questionOver', function(playerData, correct){
    clearInterval(timer);
    clearInterval(countdownTimer);
    var answer1 = 0;
    var answer2 = 0;
    var answer3 = 0;
    var answer4 = 0;
    var total = 0;
    //Hide elements on page
    document.getElementById('playersAnswered').style.display = "none";
    document.getElementById('timerText').style.display = "none";
    document.getElementById('countdown-container').style.display = "none";
    //Shows user correct answer with effects on elements
    if(correct == 1){
        document.getElementById('answer2').style.filter = "grayscale(50%)";
        document.getElementById('answer3').style.filter = "grayscale(50%)";
        document.getElementById('answer4').style.filter = "grayscale(50%)";
        var current = document.getElementById('answer1').innerHTML;
        document.getElementById('answer1').innerHTML = "&#10004" + " " + current;
    }else if(correct == 2){
        document.getElementById('answer1').style.filter = "grayscale(50%)";
        document.getElementById('answer3').style.filter = "grayscale(50%)";
        document.getElementById('answer4').style.filter = "grayscale(50%)";
        var current = document.getElementById('answer2').innerHTML;
        document.getElementById('answer2').innerHTML = "&#10004" + " " + current;
    }else if(correct == 3){
        document.getElementById('answer1').style.filter = "grayscale(50%)";
        document.getElementById('answer2').style.filter = "grayscale(50%)";
        document.getElementById('answer4').style.filter = "grayscale(50%)";
        var current = document.getElementById('answer3').innerHTML;
        document.getElementById('answer3').innerHTML = "&#10004" + " " + current;
    }else if(correct == 4){
        document.getElementById('answer1').style.filter = "grayscale(50%)";
        document.getElementById('answer2').style.filter = "grayscale(50%)";
        document.getElementById('answer3').style.filter = "grayscale(50%)";
        var current = document.getElementById('answer4').innerHTML;
        document.getElementById('answer4').innerHTML = "&#10004" + " " + current;
    }
    
    for(var i = 0; i < playerData.length; i++){
        if(playerData[i].gameData.answer == 1){
            answer1 += 1;
        }else if(playerData[i].gameData.answer == 2){
            answer2 += 1;
        }else if(playerData[i].gameData.answer == 3){
            answer3 += 1;
        }else if(playerData[i].gameData.answer == 4){
            answer4 += 1;
        }
        total += 1;
    }
    
    //Gets values for graph
    answer1 = answer1 / total * 100;
    answer2 = answer2 / total * 100;
    answer3 = answer3 / total * 100;
    answer4 = answer4 / total * 100;
    
    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";
    
    document.getElementById('square1').style.height = answer1 + "px";
    document.getElementById('square2').style.height = answer2 + "px";
    document.getElementById('square3').style.height = answer3 + "px";
    document.getElementById('square4').style.height = answer4 + "px";
    
    document.getElementById('nextQButton').style.display = "block";
    setTimeout(function() {
        // Code to be executed after the delay
        nextQuestion(); // Call the nextQuestion function after 3 seconds
      }, 3000);
    
});
 var count = 1;

function nextQuestion(){
    count++;
    document.getElementById('questionNum').innerHTML = "Question No : "+ count;
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";
    
    document.getElementById('answer1').style.filter = "none";
    document.getElementById('answer2').style.filter = "none";
    document.getElementById('answer3').style.filter = "none";
    document.getElementById('answer4').style.filter = "none";
    
    document.getElementById('playersAnswered').style.display = "block";
    document.getElementById('timerText').style.display = "none";
    document.getElementById('countdown-container').style.display = "flex";
    document.getElementById('num').innerHTML = "20";
    
    socket.emit('nextQuestion'); //Tell server to start new question
    
   

}
// function nextQuestion() {
//     // Hide the "Next Question" button
//     document.getElementById('nextQButton').style.display = "none";

//     // Hide the squares and reset filters
//     document.getElementById('square1').style.display = "none";
//     document.getElementById('square2').style.display = "none";
//     document.getElementById('square3').style.display = "none";
//     document.getElementById('square4').style.display = "none";

//     document.getElementById('answer1').style.filter = "none";
//     document.getElementById('answer2').style.filter = "none";
//     document.getElementById('answer3').style.filter = "none";
//     document.getElementById('answer4').style.filter = "none";

//     // Display the players answered and timer
//     document.getElementById('playersAnswered').style.display = "block";
//     document.getElementById('timerText').style.display = "block";
//     document.getElementById('num').innerHTML = " 20";

//     // Tell the server to start a new question
//     socket.emit('nextQuestion');

//     // Delay the execution of the nextQuestion function
//     setTimeout(function () {
//         nextQuestion();
//     }, 10000); // 10 seconds delay
// }


function updateTimer(){
    time = 20;
    timer = setInterval(function(){
        time -= 1;
        document.getElementById('num').textContent = " " + time;
        if(time == 0){
            socket.emit('timeUp');
        }
    }, 1000);
}

socket.on('GameOver', function(data){
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";
    
    document.getElementById('answer1').style.display = "none";
    document.getElementById('answer2').style.display = "none";
    document.getElementById('answer3').style.display = "none";
    document.getElementById('answer4').style.display = "none";
    document.getElementById('timerText').innerHTML = "";
    document.getElementById('countdown-container').style.display = "none";
    document.getElementById('question').innerHTML = "GAME OVER";
    document.getElementById('question').style.textAlign="center";
    document.getElementById('playersAnswered').innerHTML = "";
    document.getElementById('questionNum').style.display="none"
    
    document.getElementById('winning-card').style.display="flex";
    document.getElementById('winner1').style.display = "block";
    document.getElementById('winner2').style.display = "block";
    document.getElementById('winner3').style.display = "block";
    document.getElementById('winner4').style.display = "none";
    document.getElementById('winner5').style.display = "none";
    document.getElementById('winnerTitle').style.display = "block";
    
    document.getElementById('winner1').innerHTML = "" + data.num1;
    document.getElementById('winner2').innerHTML = "" + data.num2;
    document.getElementById('winner3').innerHTML = "" + data.num3;
    document.getElementById('winner4').innerHTML = "" + data.num4; 
    document.getElementById('winner5').innerHTML = "" + data.num5;
    
    redirectToUrl('http://localhost:3000/host/?id=1');
});
function redirectToUrl(url) {
    setTimeout(function() {
      window.location.href = url;
    }, 5000000); // 5000 milliseconds = 5 seconds
  }


socket.on('getTime', function(player){
    socket.emit('time', {
        player: player,
        time: time
    });
});








function updateCountdown() {

    // Draw the countdown circle
    var canvas = document.getElementById('countdown-canvas');
    var context = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 90;
    var startAngle = Math.PI * 1.5; // Start at the top
    var endAngle = startAngle - (2 * Math.PI * (remainingSeconds / 20)); // Calculate the end angle based on remaining seconds
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

    var countdownInterval = 50; // Update every 10 milliseconds

    countdownTimer = setInterval(function () {
        remainingSeconds -= countdownInterval / 1000; // Decrement by countdown interval in seconds
        updateCountdown();

        if (remainingSeconds == 0) {
            socket.emit('timeUp');
        }
    }, countdownInterval);
}
