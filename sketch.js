let bird;
let pipes = [];
let score = 0;
let highScore = 0;
let gameState = 'play'; 
let img;
let img2;
 
function preload(){
  img = loadImage('assets/Background.png');
  img2 = loadImage('assets/Birdy.png');   
}

function setup() {
  createCanvas(600, 400);
  bird = new Bird();
  pipes.push(new Pipe());


  let saveButton = createButton('Save Image');
  saveButton.position(500, 410); 
  saveButton.mousePressed(saveCanvasAsImage);
  
function saveCanvasAsImage() {
  saveCanvas('myCanvas', 'png'); 
}
  
}

function draw() {
  background(img);

  //DISPLAY
  if (gameState === 'play') {
 
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].show();

      if (pipes[i].hits(bird)) {
        gameState = 'gameover';
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    bird.update();
    bird.show();
    
    if (frameCount % 100 === 0) {
      pipes.push(new Pipe());
    }

    for (let i = 0; i < pipes.length; i++) {
      if (pipes[i].x + pipes[i].w < bird.x && !pipes[i].scored) {
        score++;
        pipes[i].scored = true;
      }
    }

    //SCORE
    textSize(32);
    fill(0);
    text('Score: ' + score, 70, 30);
  } else if (gameState === 'gameover') {  
    if (score > highScore) {
      highScore = score;
    }
    gameState = 'highscore';
  } else if (gameState === 'highscore') {
    textSize(64); 
    fill(0);
    textAlign(CENTER, CENTER);
    text('High Score', 300, 180);
    textSize(50);
    text(highScore, 300, 240);
    textSize(35);
    text('Press Space to Play Again', 300, 350);
  }
}

function keyPressed() {
  if (key === ' ' && (gameState === 'play' || gameState === 'gameover')) {
    bird.up();
  } else if (key === ' ' && gameState === 'highscore') {
    resetGame();
  }
}

function resetGame() {
  pipes = [];
  bird = new Bird();
  score = 0;
  gameState = 'play';
}

class Bird {
  constructor() {
    this.y = height / 2;
    this.x = 64;
    this.velocity = 0;
    this.gravity = 1;
    this.lift = -20;
  }

  show() {
    image(img2, this.x, this.y, 50, 40);
  }

  update() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;

    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }

  up() {
    this.velocity += this.lift;
  }
}

class Pipe {
  constructor() {
    this.spacing = 120;
    this.top = random(height / 6, (3 / 4) * height);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 50;
    this.speed = 2;
    this.scored = false;
  }

  show() {
    fill(49, 140, 28);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  }

  update() {
    this.x -= this.speed;
  } 

  offscreen() {
    return this.x < -this.w;
  }
 
  hits(bird) {
  if (
    bird.x + 40 > this.x && bird.x - 1 < this.x + this.w &&
    (bird.y - 1 < this.top || bird.y + 30 > height - this.bottom)
  ) {
    return true;
  } 
  return false;
}
}
