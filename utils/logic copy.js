var first_start =false;
var draw_score =0;
var turn = 'X';
var game_type = 3;
var total_turns = 0;
var robot = true;
var robot2 = false;
var finished = false;

var selections = new Array(); 
	selections['X'] = new Array();
	selections['O'] = new Array();
	selections['Y'] = new Array();
	selections['T'] = new Array();

	var scores = new Array(); 
	function initialise_score()
	{
		scores['X'] = 0;
		scores['O'] = 0;
		scores['Y'] = 0;
		scores['T'] = 0;
		scores['draw'] = 0;
	}
	initialise_score();
// Resetting parameters on reseting game
function resetParams() {
	turn = 'X';
	game_type = 3;
	total_turns = 0;
	robot = true;
	robot2 = false;
	finished = false;

	selections['X'] = new Array();
	selections['O'] = new Array();
	selections['Y'] = new Array();
	selections['T'] = new Array();
}


// Change turn after another
function changeTurn(){
	if(game_type === 3)
	{
		if (turn == 'X') turn = 'O';
		else turn = 'X';
		return;
	}
	else if (game_type ===4)
	{
		if (turn == 'X')
		{
			turn = 'O';
		} 
		else if (turn == 'O')
		{
			turn = 'Y';
		}
		else
		{
			turn = 'X';
		}
	}
	else
	{
		if (turn == 'X')
		{
			turn = 'O';
		} 
		else if (turn == 'O')
		{
			turn = 'Y';
		}
		else if (turn == 'Y')
		{
			turn = 'T';
		}
		else
		{
			turn = 'X';
		}
	}
}


// Winner patterns, match selected patterns on every turn for every player
function winnerPatterns() {
	var wins = Array();

	// 3 x 3 winning patterns;
	if (game_type==3) wins = [ 
								[11,12,13], [21,22,23], [31,32,33],
						 		[11,21,31], [12,22,32], [13,23,33], 
						 		[11,22,33], [13,22,31]
						 	];


	// 4 x 4 winning patterns;
	if (game_type==4) wins = [ 
								[11,12,13],[12,13,14], [21,22,23], [22,23,24], [31,32,33],[32,33,34], [41,42,43],[42,43,44],
						 		[11,21,31], [21,31,41], [12,22,32],[12,23,34], [22,32,42], [13,23,33], [13,22,31], [23,33,43], [14,24,34],[24,34,44],
						 		[14,23,32],[23,32,41], [11,22,33],[22,33,44],[21,32,43],[24,33,42]
						 	];

	// 5 x 5 winning patterns;
	/*
if (game_type==5) wins = [ 
								[11,12,13,14,15], [21,22,23,24,25], [31,32,33,34,35], [41,42,43,44,45], [51,52,53,54,55],
						 		[11,21,31,41,51], [12,22,32,42,52], [13,23,33,43,53], [14,24,34,44,54], [15,25,35,45,55],
						 		[11,22,33,44,55], [15,24,33,42,51]
						 	];
	*/
	if (game_type==5) wins = [ 
		[11,12,13],[12,13,14],[13,14,15], [21,22,23], [22,23,24],[23,24,25], [31,32,33],[32,33,34],[33,34,35], [41,42,43],[42,43,44],[43,44,45],[51,52,53],[52,53,54],[53,54,55],
		[11,21,31], [21,31,41],[31,41,51], [12,22,32],[12,23,34], [23,34,45], [22,32,42],[32,42,52], [13,23,33], [13,22,31],[13,24,35], [23,33,43],[33,43,53], [14,24,34],[24,34,44],[34,44,54],
		[14,23,32],[23,32,41], [15,25,35],[25,35,45],[35,45,55], [11,22,33],[22,33,44],[33,44,55],[21,32,43],[32,43,54],[24,33,42],[33,42,51], [15,24,33],[25,34,43],[34,43,52],[35,44,53], [31,42,53],
						 	];
	return wins
}


// Robot patterns, for auto players of every game board
function DefaultRobotPatterns(r_turn) {
	var robot_turns = Array();
	var points="";
	// 3 x 3 winning patterns;
	if (game_type==3) robot_turns = [22,11,33,13,21,23,12,32,31];
	// 4 x 4 winning patterns;
    //if (game_type==4) robot_turns = [11,22,33,44,14,13,12,21,31,41,42,43,24,34,32,23];
	if (game_type==4)
	{
			robot_turns=[randomBetween(21,23),randomBetween(31,32),randomBetween(33,34),34,24,43,42,41,31,21,12,13,14,44,33,randomBetween(22,23),11]; 
	 }

	// 5 x 5 winning patterns;
	if (game_type==5) 
	{
			robot_turns=[randomBetween(22,24),randomBetween(21,23),randomBetween(33,34),32,43,42,54,52,randomBetween(53,55),25,45,35,21,31,41,51,12,13,14,15,55,44,33,randomBetween(22,23),11];
	}
	return robot_turns
}

//rand generator
function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
	}

// Checking winner of selected type on selection
function checkWinner() {

	var selected = selections[turn].sort();
	var win_patterns = winnerPatterns();

	finished = false;
	for (var x=0; x < win_patterns.length; x++) {
		
		if (finished != true) { 
			finished = isWinner(win_patterns[x], selections[turn]);

			if ( finished === true ) {
			    
			    about = document.getElementsByClassName('.submit-button').value = win_patterns[x];

				for(abouts of about ){
					
					document.getElementById(abouts).style.color = "red";
				}
				
				// Updating score card
				scoreUpdate(turn);

				// On winning disabled all boxes
				disableAllBoxes();
				//document.querySelector('.submit-button').value = "Restart Game";
				//alert('Player '+turn+' Won !!');
				document.querySelector('.message').innerText ='Player '+turn+' Won !!';
				document.querySelector('.gameinfo').style.display = "block";
				document.querySelector('.submit-button').value = "Restart Game";
				break;
			} 
		}
	}

	// If no one wins; declare DRAW
	if ( ( total_turns == (game_type*game_type) ) && finished === false ) { 
		//alert('Game Draw!');
		document.querySelector('.message').innerText ='Game Drawn';
		document.querySelector('.gameinfo').style.display = "block";
		document.querySelector('.submit-button').value = "Restart Game";
		finished = true;
		scoreUpdate('draw');
		disableAllBoxes(); 
	}
	first_start =false;
}


// Verifying each selections with winning pattern
function isWinner(win_pattern, selections){

	var match = 0;

	for (var x=0; x<win_pattern.length; x++) {
		for (var y=0; y<selections.length; y++) {
			if (win_pattern[x]==selections[y]) {
				match++;
			}
		}
	}

	if (match==win_pattern.length) return true;
	return false;
}


// Disable all boxes after winning/draw
function disableAllBoxes() {

	var elements = document.getElementsByClassName("grid-box");
	for (var i = 0; i < elements.length; i++) {
	  elements[i].disabled =true;
	}

}


// Resetting autoplayer to true on change games
function resetAIButton() {
	var checkbox = document.getElementById('robot'); 	
	checkbox.checked = 'checked';
	document.querySelector('.submit-button').value = "Start Game";
	document.querySelector('.game-board').innerHTML = "";
	re_start();
}

function auto_start()
{
	first_start =true;
	document.getElementById('game_type').value ='3';
	generateGame();
}

function re_start()
{
	first_start =true;
	generateGame();
}
// Generating a board for new game
function generateGame(){
	// Reseting all initialized params as user selected new game
	resetParams();
	// Getting Variables to update global param
	game_type = Number(document.getElementById('game_type').value);

	// is auto player selected 
	robot_object = document.getElementById('robot'); 
	if (robot_object.checked === true) robot = true; 
	else  robot = false;

	// Clearing board for new game
	document.querySelector('.gameinfo').style.display = "none";
	document.getElementById('game-board').innerHTML = '';
	// Generating board
	for (var row = 1; row <= game_type; row++){
		for (var col = 1; col <= game_type; col++) {
			var unique_name = 'grid-'+row+'-'+col;
			var unique_id = row+''+col;
			var button = document.createElement("input");
			if(row == 1)
			{
				button.style.borderTop = "none";
			}
			if(row == game_type)
			{
				button.style.borderBottom = "none";
			}
			if(col ==1)
			{
				button.style.borderLeft = "none";
			}
			if(col ==game_type)
			{
				button.style.borderRight = "none";
			}
			button.setAttribute("value", ' ');
			button.setAttribute("id", unique_id);
			button.setAttribute("name", unique_name);
			button.setAttribute("class", 'grid-box');
			button.setAttribute("type", 'button');
			button.setAttribute("onclick", "markCheck(this)");
			document.getElementById('game-board').appendChild(button);
		}

		var breakline = document.createElement("br");
			document.getElementById('game-board').appendChild(breakline);
			if(first_start === true)
			{
				if(game_type ===3)
				{
					document.getElementById('score-X').innerText = '0';
					document.getElementById('score-O').innerText = '0';
					document.getElementById('score-Y').innerText = 'N/A';
					document.getElementById('y1').style.display = "none";
					
					document.getElementById('score-T').innerText = 'N/A';
					
					document.getElementById('t1').style.display = "none";
					document.getElementById('score-draw').innerText = '0';
				}
				if(game_type ===4)
				{
					document.getElementById('score-X').innerText = '0';
					document.getElementById('score-O').innerText = '0';
					document.getElementById('score-Y').innerText = '0';
					document.getElementById('score-T').innerText = 'N/A';
					document.getElementById('y1').style.display = "";
					document.getElementById('t1').style.display = "none";

					document.getElementById('score-draw').innerText = '0';
				}
				if(game_type ===5)
				{
					document.getElementById('score-X').innerText = '0';
					document.getElementById('score-O').innerText = '0';
					document.getElementById('score-Y').innerText = '0';
					document.getElementById('y1').style.display = "";
					document.getElementById('score-T').innerText = '0';
					document.getElementById('t1').style.display = "";
					document.getElementById('score-draw').innerText = '0';
				}
				initialise_score();
			}
			//document.querySelector('.submit-button').value = "Restart Game";
	}

}


// Selecting check for desired position
function markCheck(obj){

	obj.value = turn;
	total_turns++;
	if(game_type ===3)
	{
		if (turn == 'X' ) {
			obj.setAttribute("class", 'green-player');
		} else {
			obj.setAttribute("class", 'red-player');
		}
	}
	else if(game_type ===4)
	{
		if (turn == 'X' ) {
			obj.setAttribute("class", 'green-player');
		} 
		else if (turn == 'O' ) {
			obj.setAttribute("class", 'red-player');
		}
		else {
			obj.setAttribute("class", 'blue-player');
		}
	}
	else
	{
		if (turn == 'X' ) {
			obj.setAttribute("class", 'green-player');
		} 
		else if (turn == 'O' ) {
			obj.setAttribute("class", 'red-player');
		}
		else if (turn == 'Y') {
			obj.setAttribute("class", 'blue-player');
		}
		else
		{
			obj.setAttribute("class", 'purple-player');
		}
	}
	obj.setAttribute("disabled", 'disabled');
	selections[turn].push(Number(obj.id));

	checkWinner();
	changeTurn();
	
	//if auto player selected
	if (robot===true) 
	{
	setTimeout(autoTurn, 500);
	}
}


// Auto player robot turn for Y
function autoTurn(again=false) {
	is_empty_result = true;
	// Ignore for X player as well as if already finished
	if (turn === 'X' || finished === true) return false;

	// Get which winning pattern match most
	// Run according to the selected pattern
	var robot_pattern = '';
	if (again==true) robot_pattern = DefaultRobotPatterns();
	else robot_pattern = getAutoTurnPattern(); 

	for(var x = 0; x < robot_pattern.length; x++) {
		var desired_obj = document.getElementById(robot_pattern[x]);
		//console.log('==>>'+desired_obj.value);
		if (desired_obj.value == '' || desired_obj.value == ' ') { 
			markCheck(desired_obj); 
			is_empty_result = false;
			break;
		} 
	}

}


// Getting most nearest winning and lossing pattern
function getAutoTurnPattern() {
	var pattern = [];
	if(game_type ===3)
	{
			pattern = getMostNearestPattern('O');
		if (pattern.length <= 0) {
			pattern = getMostNearestPattern('X');
			if (pattern.length <= 0) {
				pattern = DefaultRobotPatterns();
			}
		}
	}
	else if(game_type ===4)
	{
		pattern = getMostNearestPattern('O');
		if (pattern.length <= 0) {
			pattern = getMostNearestPattern('X');
			if (pattern.length <= 0) {
					pattern = getMostNearestPattern('Y');
					if (pattern.length <= 0) {
					pattern = DefaultRobotPatterns();
				}
			}
		}
	}
	else
	{
		pattern = getMostNearestPattern('O');
		if (pattern.length <= 0) {
			pattern = getMostNearestPattern('X');
			if (pattern.length <= 0) {
					pattern = getMostNearestPattern('Y');
					if (pattern.length <= 0) {
						pattern = getMostNearestPattern('T');
					if (pattern.length <= 0) {
					pattern = DefaultRobotPatterns();
					}
				}
			}
		}
	}
	return pattern;	
}


// Getting most applicable pattern for any player
function getMostNearestPattern(turn){

	var matches = 0;

	var selected = selections[turn].sort();
	var win_patterns = winnerPatterns();

	finished = false;
	for (var x=0; x < win_patterns.length; x++) {
		var intersected = intersectionArray(selected, win_patterns[x]);

		if ( intersected.length==(win_patterns[x].length-1) ) { //return win_patterns[x];

			// if any position is found empty then return that pattern; otherwise will check another one from list
			for (var y=0; y < win_patterns[x].length; y++) {
				obj = document.getElementById(win_patterns[x][y]);
				if (obj.value == '' || obj.value == ' ') {
					// Return pattern if got an empty; otherwise will match others 
					return win_patterns[x];	
				}
			}
		}

	}
	return [];
}


// Return intersaction result by comparing 
// Players' turns and Winning patterns
function intersectionArray(x, y){

    var response = [];
    for (var i = 0; i < x.length; i++) {
        for (var z = 0; z < y.length; z++) {
            if (x[i] == y[z]) {
                response.push(x[i]);
                break;
            }
        }
    }
    return response;

}


function scoreUpdate(turn){
	scores[turn]++;
	document.getElementById('score-'+turn).innerHTML = scores[turn];
}
