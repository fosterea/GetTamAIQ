const l_rate = .5;
let moves = {};
let games = 0;
let target_tile = 7;
let outcomes = [];
let igames = 0;

function getMove() {
	
	let rows = get_board();
	if (! (rows in moves)) {
		create_state(moves, rows);
	}
	
	let action = choose_action(rows, .1);

	move_action(action);
	board.display();

	let new_state = get_board();
	let old_state = rows;

	if (goal_achieved(new_state)) {
		update(new_state, action, old_state, Math.pow(target_tile, 2));
		resetup();
		console.log(games);
		outcomes.push(1);
		games ++;
		igames ++;
	} else if (available_actions(new_state).size == 0) {
		update(new_state, action, old_state, -1);
		resetup();
		console.log('loss');
		outcomes.push(0)
		console.log(get_board_value(new_state))
		console.log(games);
		games ++;
		igames ++;
	} else {
		update(new_state, action, old_state, 0);
	}
	console.log('move made');
	/* 
		
	*/
}

function update(new_state, action, old_state, reward) {

	if (! (new_state in moves)) {
		create_state(moves, new_state);
	}
	
	let old_val = moves[old_state]['actions'][action];
	let best_future = moves[new_state]['max'];
	let new_val = old_val + l_rate * ((reward + best_future) - old_val);
	moves[old_state]['actions'][action] = new_val;
	if (new_val > moves[old_state].max) {
		moves[old_state].max = new_val;
	}
}

function choose_action(state, epsilon) {
	let actions = [];
	let max_key = null;
	let max_value = -1;
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

function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

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
}




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

function get_board_value (rows) {
	let val = 0;
	for (let i = 0; i < rows.length; i ++) {
		for (let j = 0; j < rows[i].length; j ++) {
			val += Math.pow(rows[i][j], 2);
		}
	}
	return val;
}


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



function get_moves() {
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
	// // convert JSON object to string
	// let json = JSON.stringify(moves);
	// var blob = new Blob([json], {type: "application/json"});
	// var url  = URL.createObjectURL(blob);

	// var a = document.createElement('a');
	// a.download    = "tam-solver.json";
	// a.href        = url;
	// a.textContent = "Download backup.json";
	// a.style.display = 'none';
	// document.body.appendChild(a);
	// a.click();
	// console.log(games);

	// let first_avg = 0;
	// let second_avg = 0;
	// for (let i = 0; i < 20; i++) {
	// 	let j = i + 40;
	// 	first_avg += outcomes[i];
	// 	second_avg += outcomes[j];
	// }
	// first_avg /= 20;
	// second_avg /= 20;
	// console.log(first_avg);
	// console.log(second_avg);
}

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