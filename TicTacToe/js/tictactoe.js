//whose turn is it
let activePlayer = 'X';
//stores array of moves. determines win conditions.
let selectedSquares = [];

//function for placing an x or o in a square
function placeXOrO(squareNumber) {
    //ensures a square hasn't been selected already
    //.some() checks each element of selected square array
    //to see if it contains the square number clicked on
    if (!selectedSquares.some(element => element.includes(squareNumber))) {
        //retrieves the html element id clicked 
        let select = document.getElementById(squareNumber);
        //checks who's turn it is
        if (activePlayer === 'X') {
            //if activePlayer = X, x.png is placed
            select.style.backgroundImage = 'url("images/x.png")';
            //activePlayer may only be X or O, if not X then must be O
        } else {
            //activePlayer is O, the o.png is placed
            select.style.backgroundImage = 'url("images/o.png")';
        }
        //squareNumber and activePlayer are concat and added to array
        selectedSquares.push(squareNumber + activePlayer);
        //calls a function to check for any win conditions
        checkWinConditions();
        //condition to change the active player
        if (activePlayer === 'X') {
            //if active player is X, change it to O.
            activePlayer = 'O';
        //if active player is anything other than X
        } else {
            //Change activePlayer to X
            activePlayer = 'X';
        }
        //function to play placement sounds
        audio('./media/place.mp3');
        //condition checks if it is computer's turn
        if (activePlayer === 'O') {
            //function disables clicking for computer's choice
            disableClick();
            //function waits 1 second b4 comp places image and eneable click.
            setTimeout(function () { computersTurn(); }, 1000)
        }
        //returning true needed for computersTurn() to work.
        return true;
    }
    //function results in selection of random square
    function computersTurn() {
        //boolean needed for the while loop
        let success = false;
        //variable stores a random number 0-8.
        let pickASquare;
        //condition allows while loop to trying if square is already selected
        while(!success) {
            //random number b/w 0-8 is selected
            pickASquare = String(Math.floor(Math.random() * 9));
            //if random number returns true, square hasn't been selected yet
            if (placeXOrO(pickASquare)) {
                //calls the function
                placeXOrO(pickASquare);
                //changes the boolean and ends the loop
                success = true;
            }
        }
    }
}

//function parses the selectedSquares array searching for win conditions
//drawWinLine function draws a line if condition is met
function checkWinConditions() {
    //X 0, 1, 2 condition.
    if (arrayIncludes('0X', '1X', '2X')) { drawWinLine(50, 100, 558, 100) }
    else if (arrayIncludes('3X', '4X', '5X')) { drawWinLine(50, 304, 558, 304) }
    else if (arrayIncludes('6X', '7X', '8X')) { drawWinLine(50, 508, 558, 508) }
    else if (arrayIncludes('0X', '3X', '6X')) { drawWinLine(100, 50, 100, 558) }
    else if (arrayIncludes('1X', '4X', '7X')) { drawWinLine(304, 50, 304, 558) }
    else if (arrayIncludes('2X', '5X', '8X')) { drawWinLine(508, 50, 508, 558) }
    else if (arrayIncludes('6X', '4X', '2X')) { drawWinLine(100, 508, 510, 90) }
    else if (arrayIncludes('0X', '4X', '8X')) { drawWinLine(100, 100, 520, 520) }
    else if (arrayIncludes('0O', '1O', '2O')) { drawWinLine(50, 100, 558, 100) }
    else if (arrayIncludes('3O', '4O', '5O')) { drawWinLine(50, 304, 558, 304) }
    else if (arrayIncludes('6O', '7O', '8O')) { drawWinLine(50, 508, 558, 508) }
    else if (arrayIncludes('0O', '3O', '6O')) { drawWinLine(100, 50, 100, 558) }
    else if (arrayIncludes('1O', '4O', '7O')) { drawWinLine(304, 50, 304, 558) }
    else if (arrayIncludes('2O', '5O', '8O')) { drawWinLine(508, 50, 508, 558) }
    else if (arrayIncludes('6O', '4O', '2O')) { drawWinLine(100, 508, 510, 90) }
    else if (arrayIncludes('0O', '4O', '8O')) { drawWinLine(100, 100, 520, 520) }
    //checks for tie. If none of the above register and 9 squares are selected, execute code.
    else if (selectedSquares.length >= 9) {
        //plays the tie game sound
        audio('./media/tie.mp3');
        //sets a .3 sec timer b4 resetGame is called
        setTimeout(function () { resetGame(); }, 1000);
    }
    //function checks if array includes 3 strings. checks for win condition.
    function arrayIncludes(squareA, squareB, squareC) {
        //3 variables used to check for 3 in a row
        const a = selectedSquares.includes(squareA)
        const b = selectedSquares.includes(squareB)
        const c = selectedSquares.includes(squareC)
        //if 3 variables are all included in the array true is returned and elese if 
        //condition executes the drawWinLine function.
        if (a === true && b === true && c === true) { return true }
    }
}

//function that makes the body element temporarily unclickable
function disableClick() {
    //makes body unclickable
    body.style.pointerEvents = 'none';
    //This makes body clickable after 1 sec.
    setTimeout(function() {body.style.pointerEvents = 'auto';}, 1000);
}

//this function takes string parameter of path set earlier for placement sound
//('./media/place.mp3')
function audio(audioURL) {
    //created a new audio object and pass the path as a parameter
    let audio = new Audio(audioURL);
    //play method plays audio sound
    audio.play();
}

//function utilizes html canvas to draw win lines
function drawWinLine(coordX1, coordY1, coordX2, coordY2) {
    //accesses the html canvas element
    const canvas = document.getElementById('win-lines')
    //gives access to methods and properties to use on canvas
    const c = canvas.getContext('2d');
    //start of x axis
    let x1 = coordX1,
        y1 = coordY1,
        //end of a line's x-axis
        x2 = coordX2, 
        y2 = coordY2,
        //var stores temporary x axis data updates in animation loop
        x = x1, 
        y = y1;
    
    //function interacts with the canvas
    function animateLineDrawing() {
        //var creates a loop
        const animationLoop = requestAnimationFrame(animateLineDrawing);
        //method clears content from last loop iteration
        c.clearRect(0, 0, 608, 608)
        //starts a new path
        c.beginPath();
        //moves to the starting point of the line
        c.moveTo(x1, y1)
        //indicates end point in the line
        c.lineTo(x, y)
        //sets width of line
        c.lineWidth = 10;
        //sets line color
        c.strokeStyle = 'rgba(70, 255, 33, .8)';
        //method draws everything laid out
        c.stroke();
        //condition checks if the endpoint is reached
        if (x1 <= x2 && y1 <= y2) {
            //condition adds 10 to the previous end x point
            if (x < x2) { x += 10; }
            if (y < y2) { y += 10; }
            //condition cancels the animation loop
            //if the end points are reached
            if (x >= x2 && y >= y2) { cancelAnimationFrame(animationLoop); }
        }
        //similar to above, necessary to 6, 4, 2 win condition
        if (x1 <= x2 && y1 >= y2) {
            if (x < x2) { x += 10; }
            if (y > y2) { y -= 10; }
            if (x >= x2 && y <= y2) { cancelAnimationFrame(animationLoop); }
        }
    }
    //function clears canvas after drawn win line
    function clear() {
        //line starts animation loop
        const animationLoop = requestAnimationFrame(clear);
        //clears canvas
        c.clearRect(0, 0, 608, 608);
        //stops animation loop
        cancelAnimationFrame(animationLoop); 
    }
    //disallows clicking while win sound is playing
    disableClick();
    //plays win sounds
    audio('./media/winGame.mp3');
    //calls main animation loop
    animateLineDrawing();
    //waits 1sec, then, clears canvas, resets game, allows clicking again
    setTimeout(function () { clear(); resetGame(); }, 1000);
}

//resets game in tie or win
function resetGame() {
    //for loop iterates through each HTML square element
    for (let i = 0; i < 9; i++) {
        //var gets the html element of i
        let square = document.getElementById(String(i))
        square.style.backgroundImage = ''
    }
    //resets array so it is empty and can start over
    selectedSquares = [];
}