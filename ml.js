const l_rate = .5;
let moves = {};
let games = 0;
let target_tile = 7;
let outcomes = [];
let igames = 0;


/*
* Plays one move of the game.
*/ 
function getMove() {

	// Gets the board state (rows)
	let rows = get_board();
	// Adds state to dict
	if (! (rows in moves)) {
		create_state(moves, rows);
	}
	// Choses an action, providing
	// the state and the epsilon value
	let action = choose_action(rows, .1);

	// Update board
	move_action(action);

	let new_state = get_board();
	let old_state = rows;

	// Check if won
	if (goal_achieved(new_state)) {
		// Reward the the state
		update(new_state, action, old_state, Math.pow(target_tile, 2));
		resetup();

		// Progress trackers I used
		console.log(games);
		outcomes.push(1);
		games ++;
		igames ++;


	// Check if lost
	} else if (available_actions(new_state).size == 0) {
		// Punish the state
		update(new_state, action, old_state, -1);
		resetup();

		// Progress trackers I used
		console.log('loss');
		outcomes.push(0)
		console.log(get_board_value(new_state))
		console.log(games);
		games ++;
		igames ++;


	// No victory, update Q values with no reward.
	} else {
		update(new_state, action, old_state, 0);
	}
	console.log('move made');
}


/*
* Updates the Q value at the end of the game
*/
function update(new_state, action, old_state, reward) {
	// Checks if the state exists
	if (! (new_state in moves)) {
		create_state(moves, new_state);
	}
	
	// Update Q value
	let old_val = moves[old_state]['actions'][action];
	let best_future = moves[new_state]['max'];
	let new_val = old_val + l_rate * ((reward + best_future) - old_val);
	moves[old_state]['actions'][action] = new_val;

	// Update old_state's best future
	// if this is the best future.
	if (new_val > moves[old_state].max) {
		moves[old_state].max = new_val;
	}
}

/*
* Choses an action randomly based on
* the probability specified by the epsilon
* value. 
*/
function choose_action(state, epsilon) {
	let actions = [];
	let max_key = null;
	let max_value = -1;
	// Finds the best action and collects
	// actions for random choice.
	for (const [key, value] of Object.entries(moves[state].actions)) {
		actions.push(key)
		if (value > max_value) {
			max_value = value;
			max_key = key;
		}
	}

	if (moves[state].layer < target_tile - 1 && // Excludes earlier layers
		(Math.random() <= epsilon || max_key == null)) {
        return choose(actions);
	}
	return max_key;
}

/*
* Makes a random choice
*/
function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

/*
* Updates the board.
*/
function move_action(action) {
	if (action == 'up') {
		// board.moveUp();
		movement.y = -1;
	} else if (action == 'down') {
		// board.moveDown();
		movement.y = 1;
	} else if (action == 'left') {
		// board.moveLeft();
		movement.x = -1;
	} else if (action == 'right') {
		// board.moveRight();
		movement.x = 1;
	}

	// updates the board based on
	// the movments vector.
	// Its a vestige on when
	// this was an actual game.
	board.display();
}

/*
* Converts the boards representation
* of rows into a 2D array of ints.
*/
function get_board() {
	let rows = board.rows;
	let new_rows = []
	for (let i = 0; i < rows.length; i ++) {
		new_rows.push([]);
		for (let j = 0; j < rows[i].length; j ++) {
			if (rows[i][j] != 0) {
				new_rows[i].push(rows[i][j].val);
			} else {
				new_rows[i].push(0);
			}
		}
	}
	return new_rows;
}

/*
* Function used for state assesment.
*/
function get_board_value (rows) {
	let val = 0;
	for (let i = 0; i < rows.length; i ++) {
		for (let j = 0; j < rows[i].length; j ++) {
			val += Math.pow(rows[i][j], 2);
		}
	}
	return val;
}

/*
* Adds a state to the dict provided.
* A state contains a best expected 
* value, a dict mapping available actions
*/
function create_state(dict, state) {
	dict[state] = {};
	let val = 0; // get_board_value(state);
	dict[state]['actions'] = {};
	let actions = available_actions(state);
	for (action of actions) {
		dict[state]['actions'][action] = val;
	}
	dict[state]['max'] = val;
	dict[state]['layer'] = get_layer(state);
}

// Returns the number of the layer the
// state belongs to.
function get_layer(state) {
	max_val = 1;
	for (let col of state) {
		for (let tile of col) {
			if (tile > max_val) {
				max_val = tile;
			}
		}
	}
	return max_val;
}

/*
Returns a set of available actions
('up', 'down', 'right', 'left')
*/
function available_actions(state) {
	let actions = new Set();
	for (let i of state) {
		// Set old tile to not be equal the anything
		old_tile = -1;
		for (let tile of i) {
			if (old_tile == tile && tile > 0) {
				actions.add('left');
				actions.add('right');
			}
			else if (old_tile == 0 && tile > 0) {
				actions.add('left');
			}
			else if (tile == 0 && old_tile > 0) {
				actions.add('right');
			}
			old_tile = tile;
		}
	}
	let t_state = transpose(state);
	for (let i of t_state) {
		// Set old tile to not be equal the anything
		old_tile = -1;
		for (let tile of i) {
			if (old_tile == tile && tile > 0) {
				actions.add('up');
				actions.add('down');
			}
			else if (old_tile == 0 && tile > 0) {
				actions.add('up');
			}
			else if (tile == 0 && old_tile > 0) {
				actions.add('down');
			}
			old_tile = tile;
		}
	}
	return actions;
}

/*
Returns true if the state has the
target tile in it.
*/
function goal_achieved(state) {
	for (let i in state) {
		for (let j in state[i]) {
			if (state[i][j] == target_tile) {
				return true;
			}
		}
	}
	return false;
}


/*
* The game loop that runs the training.
* I slowly increase the target tile, hoping
* to create pre existing knowledge about how
* to get to heigher tiles. Kind of like
* transfer learning.
*/
function get_moves() {
	// I use igmaes to track the number
	// of games in one learing period.
	// igmaes is reset each time, whereas
	// games is not and has the total.
	target_tile = 2;
	while (igames < 400) {
		getMove();
	}
	target_tile = 3;
	igames = 0;
	while (igames < 500) {
		getMove();
	}
	target_tile = 4;
	igames = 0;
	while (igames < 800) {
		getMove();
	}
	target_tile = 5;
	igames = 0;
	while (igames < 1000) {
		getMove();
	}
	target_tile = 6;
	igames = 0;
	while (igames < 2000) {
		getMove();
	}
	target_tile = 7;
	igames = 0;
	while (igames < 3200) {
		getMove();
	}
	target_tile = 8;
	igames = 0;
	while (igames < 6400) {
		getMove();
	}
}


/*
* Used to reset the game
*/
function resetup() {
  won = false;
  cnv = createCanvas(616, 616);
	// Tie canvas to a div
	board = cnv.parent("board");

  score = 0;
  bestSchool = 0;

  update_score(0);
  update_school(0);
  
  addSwipe();
  
  board = new Board(4, 4);
  movement = createVector(0, 0);
  
  background(255);

	board.display();

}