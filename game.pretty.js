/*This is the JS program that controls the dynamics of the dice roll game
  
The program uses the following alogrothm to succes fully run the game:
    It has three stages:
    1. Validate input from the user for the number of dice to be used to play the game
    2. Setup the game and the game display
    3. Rund the game and take input from user to either play another round or end the game.

Some of the code in the program has been inspired by the www.w3schools.com repository
*/

function diceArrayGenerator(n) {
/* function to randomlty generate an array of dice outputs (1-6)
    takes number of dice (n) as input and return an array of dice outputs */
    var arr = new Array();
    for (i=0; i < n; i++){
        rand = Math.floor(Math.random()*6)+1;
        arr.push(rand);
    }
    return arr;
}


function validateUserInput() {
    var input = document.getElementById("inputField").value;
    // configure range of dice face numbers
    const min = 3;
    const max = 6;
    
    if (min<=parseInt(input) && parseInt(input)<=max && input.length == 1) {
        
        // success message
        document.querySelector("#numDice").innerHTML = "You have selected " + input + " dice.";
        // assign valid input to numberOfDice
        numberOfDice = input;

        // once valid input received initialise game setup
        const divElMainDiv = document.getElementById("mainDiv");
        divElMainDiv.innerHTML += `
            <div id="setup">
                <button id="setUpButton" onclick="setUpGame()">Setup Game!</button>
            </div>
        `;

        // disable select input button to trigger further
        const submitBttn = document.getElementById("submitBttn");
        submitBttn.disabled = true;

        const inputBox = document.getElementById("inputField");
        inputBox.disabled = true;

        const clearButton = document.getElementById("clearBttn");
        clearButton.disabled = true;

    }

    else {
        // error message
        document.querySelector("#numDice").innerHTML = "Error: Ivalid input, try again!!";
    }

}


// game setup
function setUpGame() {

    // intialise the dice area
    const divElMainDiv = document.getElementById("mainDiv");
    divElMainDiv.innerHTML += `
    
        <div id="diceDisplayArea">
            <br>
            <!-- dice grid going to create here -->
        </div>
    `;

    /* following code snippet is inspired by:
    https://github.com/phptuts/js-video-projects/blob/dynamically-adding-table-row-finish/dynamic-table-row.html
    */
    // intialise the dice with blank faces
    divElDiceDisplay = document.getElementById("diceDisplayArea");
    for (j=0; j<numberOfDice; j++) {

        divElDiceDisplay.innerHTML += `
   
            <div class="dice">
                <p id="diceLabel">DICE ${j+1}</p>
                <img src="faces/blank.png">
            </div>

    `;
    }
    /* initialise the Start Game and End Gamne button
       intialise the statistics/status dsiplay area */
    divElMainDiv.innerHTML += `
        <div id="controller">
            <button id="startGameButton" onclick="playGame()">Start Game!</button>
            <button id="endGameButton" onclick="endGame()">End Game!</button>
        </div>

        <div id="statistics">
            <p id="status">STATUS: Game not started yet!</p>
            <p id="counter">Round: NULL</p>
            <p id="roundScore">Current Round Points: NULL</p>
            <p id="balance">Points Balance: NULL</p>
        </div>
    `;
    // dsiable the setup button
    const bttn = document.getElementById("setUpButton");
    bttn.disabled = true;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// game play code

// intialise the variables
var roundCounter = 0;
var currRoundScore = 0;
var totalBalancecore = 0;

/* first the array is sorted only then the following functions will work
   sorting helps to easliy group the values in the array */

// function to check if all values in the array are same
const allEqual = arr => arr.every( v => v === arr[0] );

// function to check if N-1 vlaues are same
function nMinusOneSame(arr){
    
    l = arr.length;
    if (arr[0] != arr[1] && allEqual(arr.slice(1,l)) || arr[l-1] != arr[l-2] && allEqual(arr.slice(0,l-1))) {
        return true;
    }
    return false;
}

/* check if all the values in the 
   array are strictly increasing by 1 */
function isIncreasingByOne(arr) {
    var prev, cur;
  
    for (var i = 0; i < arr.length; i++) {
        cur = arr[i];
        if (i && cur != prev+1) return false;
        prev = cur;
    }
  
    return true;
}
/* check if all the values in
   the array are strictly increasing */
function isIncreasing(arr) {
    var prev, cur;

    for (var i = 0; i < arr.length; i++) {
        cur = arr[i];
        if (i && cur == prev) return false;
        prev = cur;
    }

    return true;
}

/* main function to calculate the score of each round
   based on the distriburtion of the values in the array
   the array is sorted before running through the followin */
function roundScoreCalculator (diceArray) {

    // sort the array in ascending order
    diceArray.sort((a,b) => a-b);

    /* check if all N values same and add 60 to 
       current round score + sum of all values */
    if ( allEqual(diceArray) ) {
        currRoundScore = 60 + diceArray.reduce((a, b) => a + b, 0);
    }

    /* check if not N but N-1 values are same and add 
    40 to current round score + sum of all values */
    else if ( nMinusOneSame(diceArray) ) {
        currRoundScore = 40 + diceArray.reduce((a, b) => a + b, 0);
    }

    /* check if it is a run (a sequence K+1 to K+N for some K ≥ 0)
       add 20 to the score + sum of all value */
    else if ( isIncreasingByOne(diceArray) ) {
        currRoundScore = 20 + diceArray.reduce((a, b) => a + b, 0);

    }

    /* check if not a run but all values are different
       add sum of all values to the score */
    else if ( isIncreasing(diceArray) ) {
        currRoundScore = diceArray.reduce((a, b) => a + b, 0);
        
    }
    // round score is 0
    else {
        currRoundScore = 0;
    }

    return currRoundScore;

}

// trigger game
function playGame() {

    const startBttn = document.getElementById("startGameButton");
    startBttn.innerHTML = "Play Another Round!";

    diceArray = diceArrayGenerator(numberOfDice);

    for (j=0; j<diceArray.length; j++) {
        const imgSrc = "faces/dice" + diceArray[j] + ".png"; 
        document.querySelectorAll('img')[j].setAttribute('src',imgSrc);

    }
    roundCounter += 1;
    currRoundScore = roundScoreCalculator(diceArray);
    totalBalancecore += currRoundScore;
    
    document.getElementById("status").innerHTML = "STATUS: Game Running!!";
    document.getElementById("counter").innerHTML = "Round: " + roundCounter;
    document.getElementById("roundScore").innerHTML = "Current Round Points: " + currRoundScore;
    document.getElementById("balance").innerHTML = "Points Balance: " + totalBalancecore;

}

// end game
function endGame() {

    var avgScorePerRound=0;

    if (roundCounter == 0) {
        avgScorePerRound = 0;
    }
    else {
        avgScorePerRound = (totalBalancecore/roundCounter).toFixed(1);
    }

    document.getElementById("status").innerHTML = "STATUS: Game Ended!!";
    document.getElementById("counter").innerHTML = "Total Rounds Played: " + roundCounter;
    document.getElementById("roundScore").innerHTML = "Total Balance Points: " + totalBalancecore;
    document.getElementById("balance").innerHTML = "Average Points per Round: " + avgScorePerRound;
    

    const divElMainDiv = document.getElementById("mainDiv");
    divElMainDiv.innerHTML += `
        <button onClick="window.location.reload();">Reload Game</button>
    `;

    const playBttn = document.getElementById("startGameButton");
    playBttn.disabled = true;

    const endBttn = document.getElementById("endGameButton");
    endBttn.disabled = true;

}