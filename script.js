// 2048 Tamalpais  1908
// 1024 Branson  1917
// 512 San Rafael  1924
// 256 Marin Catholic  1949
// 128 Archie Williams   1951
// 64 Novato  1957
// 32 Redwood  1958
// 16 Terra Linda  1960
// 8 San Marin  1967
// 4 Marin Academy  1971
// 2 TamisCal  1990

const keys = [];
let keyDown = [];
let keyUp = [];
let movement;

let numbers = false;

let cnv;
let board;
let icons = [];

let won = false;

function preload() {
  icons = [
    loadImage("images/tamiscal.png"),
    loadImage("images/ma.png"),
    loadImage("images/sanmarin.png"),
    loadImage("images/tl.png"),
    loadImage("images/redwood.png"),
    loadImage("images/novato.png"),
    loadImage("images/archie.jpeg"),
    loadImage("images/mc.png"),
    loadImage("images/sr.jpg"),
    loadImage("images/branson.png"),
    loadImage("images/tam.png"),
  ];

  hawkSound = loadSound("sounds/hawk.mp3");
}


function setup() {
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

	get_moves();
}

function draw() {
  translate(8, 8);
  background(225);
  
  if(keyDown[38] || keyDown[87]) movement.y = -1;
  if(keyDown[40] || keyDown[83]) movement.y = 1;
  if(keyDown[37] || keyDown[65]) movement.x = -1;
  if(keyDown[39] || keyDown[68]) movement.x = 1;
  
  board.display();
	// getMove();
	
  if(keyUp[32]) setup();
  
  keyDown = [];
  keyUp = [];
  movement.set(0, 0)
}


function keyPressed() {
  keys[keyCode] = true;
  keyDown[keyCode] = true;
}
function keyReleased() {
  keys[keyCode] = false;
  keyUp[keyCode] = true;

  if(keyCode == 27) clearCookies();
}


function clearCookies() {
  setCookie("maxScore", 0, 0);
  setCookie("maxSchool", 0, 0);
  setup();
}




// function windowResized() {
//   let pt = (windowHeight-height)/2;
//   let pl = (windowWidth-width)/2
//   cnv.position(pl, pt);
// }
