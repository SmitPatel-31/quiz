var socket = io();
var playerAnswered = false;
var correct = false;
var name;
var score = 0;
var rightAnswer;
var playerans;
var params = jQuery.deparam(window.location.search); //Gets the id from url

socket.on('connect', function() {
    //Tell server that it is host connection from game view
    socket.emit('player-join-game', params);
    // document.getElementById('question').textContent = data.q1; 
    document.getElementById('answer1').style.visibility = "visible";
    document.getElementById('answer2').style.visibility = "visible";
    document.getElementById('answer3').style.visibility = "visible";
    document.getElementById('answer4').style.visibility = "visible";
});

socket.on('noGameFound', function(){
    window.location.href = '../../';//Redirect user to 'join game' page 
});


// Connect to the server


// Listen for the gameQuestions event
// socket.on('gameQuestions', function (data) {
//   var question = data.q1;

//   // Update the question and options on the player1.html page
//   document.getElementById('question').textContent = question;
  
// });

  
function answerSubmitted(num){
    if(playerAnswered == false){
        playerAnswered = true;
        playerans = num;
        socket.emit('playerAnswer', num);//Sends player answer to server
        
        //Hiding buttons from user
        document.getElementById('question').style.display = "none";
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
        document.getElementById('answer3').style.visibility = "hidden";
        document.getElementById('answer4').style.visibility = "hidden";
        // document.getElementById('answer'+num).style.border = "2px solid #5B9DFF";
        document.getElementById('message').style.display = "block";
        document.getElementById('questionNum').style.display = "none";
        document.getElementById('message').innerHTML = "Answer Submitted! Waiting for other players...";
        
    }
}



//Get results on last question
socket.on('answerResult', function(data){
    if(data == true){
        correct = true;
    }
});

// Connect to the server

// Listen for the gameQuestions event


socket.on('questionOver', function(data){
    var myAnswer = data[0].gameData.answer;
    data.forEach(element => {
        if(element.name == params.name)
        {
            myAnswer = element.gameData.answer;
        }
    });
    document.getElementById('question').style.display = "block";
    document.getElementById('questionNum').style.display = "block";
    document.getElementById('message').style.display = "none";
    document.getElementById('answer1').style.visibility = "visible";
    document.getElementById('answer2').style.visibility = "visible";
    document.getElementById('answer3').style.visibility = "visible";
    document.getElementById('answer4').style.visibility = "visible";
    var current = document.getElementById('answer'+myAnswer).innerHTML;
    if(correct == true){
        document.getElementById('answer'+myAnswer).style.color = "green";
        document.getElementById('answer'+myAnswer).style.border = "2px solid green";
        document.getElementById('answer'+myAnswer).innerHTML = "&#10004" + " " +current;
        
    }else{
        document.getElementById('answer'+myAnswer).style.color = "red";
        document.getElementById('answer'+myAnswer).style.border = "2px solid red";
        document.getElementById('answer'+myAnswer).innerHTML = "&#10008" + " " + current;
        
    }
    
    socket.emit('getScore');
});

socket.on('newScore', function(data){
    document.getElementById('scoreText').innerHTML = "Score: " + data;
});

var count = 1;

socket.on('nextQuestionPlayer', function(data){
    correct = false;
    playerAnswered = false;
    console.log(data);
    count++;
    document.getElementById('questionNum').innerHTML = "Question No : "+ count;
    document.getElementById('answer1').style.border = "none";
    document.getElementById('answer2').style.border = "none";
    document.getElementById('answer3').style.border = "none";
    document.getElementById('answer4').style.border = "none";
    document.getElementById('answer1').style.color = "#666";
    document.getElementById('answer2').style.color = "#666";
    document.getElementById('answer3').style.color = "#666";
    document.getElementById('answer4').style.color = "#666";
    document.getElementById('answer1').style.visibility = "visible";
    document.getElementById('answer2').style.visibility = "visible";
    document.getElementById('answer3').style.visibility = "visible";
    document.getElementById('answer4').style.visibility = "visible";
    document.getElementById('message').style.display = "none";
    document.getElementById('question').style.display = "block";
    document.getElementById('question').textContent = data.q1; 
    document.getElementById('answer1').textContent = data.a1; 
    document.getElementById('answer2').textContent = data.a2; 
    document.getElementById('answer3').textContent = data.a3; 
    document.getElementById('answer4').textContent = data.a4; 
    document.body.style.backgroundColor = "white";
    
});

socket.on('hostDisconnect', function(){
    window.location.href = "../../";
});

socket.on('playerGameData', function(data){
   for(var i = 0; i < data.length; i++){
       if(data[i].playerId == socket.id){
           document.getElementById('nameText').innerHTML = "Name: " + data[i].name;
           document.getElementById('scoreText').innerHTML = "Score: " + data[i].gameData.score;
       }
   }
});

socket.on('GameOver', function(){
    document.body.style.backgroundColor = "#FFFFFF";
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
    document.getElementById('question').style.display = "none";
    document.getElementById('message').style.display = "block";
    document.getElementById('message').innerHTML = "GAME OVER";
    
    redirectTopath();
});

function redirectTopath() {

    setTimeout(function() {

    var cachedData = localStorage.getItem('playerCache');

    if (cachedData) {
        var path = 'http://192.168.0.13/' + encodeURIComponent(cachedData);
        window.location.href = path;
      } else {
        console.log('Cache is not saved. Unable to redirect.');
      }    
        
      }, 10000); 
    
  }
