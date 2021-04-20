/***********************************************************************************
  MoodyMaze
  by Scott Kildall

  Uses the p5.2DAdventure.js class 
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;

//variables for sprites
var playerSprite;
var playerAnimation;
var animalSprite; 
var animalSprite2; 
var animalSprite3; 
var animalSprite4;
var animalSprite5; 
var animalSprite6;
var animalSprite7;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// indexes into the clickable array (constants)
const playGameIndex = 0;

var changeState; 
// make sure we only play crossy roads once 
var playGame = true; 
// variables for crossy roads 
var cars; 
var yellowCar; 
var cars2; 
var yellowCar2; 

// variables for puppy font
var puppyFont = null; 

// variable for challenges completed
var challengesCompleted = 0; 
var carrots = 0; 
var carrot; 
var yarn = 0; 
var yarnball; 
var raindrop; 

var timer;
var seconds = 0; 

var tb = 0; 
var tennisBall; 
var gravity = 1; 
var jump = 15; 
var cheese = 0; 
var cheese_image; 

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
  chase_image = loadImage('assets/avatars/chase.png'); 
  max_image = loadImage("assets/avatars/golden retriever.png"); 
  turtle_image = loadImage("assets/avatars/turtle.png"); 
  cat_image = loadImage("assets/avatars/cat.png");
  bunny_image = loadImage("assets/avatars/bunny.png")
  buddy_image = loadImage("assets/avatars/dachsund.png");
  pig_image = loadImage("assets/avatars/pig.png");
  mouse_image = loadImage("assets/avatars/mouse.png"); 
  puppyFont = loadFont('fonts/Puppybellies-JyRM.ttf');
  carrot = loadImage("assets/carrot.png");
  yarnball = loadImage("assets/ball of yarn.png"); 
  raindrop = loadImage("assets/raindrop.png"); 
  tennisBall = loadImage("assets/tennis ball.png"); 
  cheese_image = loadImage("assets/cheese.png"); 
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);
  
  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  cars = new Group(); 
  cars2 = new Group(); 

  carrot.resize(120,143);
  yarnball.resize(74,64); 
  raindrop.resize(62,53); 
  tennisBall.resize(84,74); 
  cheese_image.resize(100,92); 

  // create a sprite and add the 3 animations
  playerSprite = createSprite(166, 148, 0, 720);
  playerSprite.position.y = 660; 
  playerSprite.position.x = 60; 
  chase_image.resize(166,148);  
  playerSprite.addAnimation('normal', chase_image, chase_image);

  animalSprite = createSprite(266,187,300,300); 
  max_image.resize(266,187); 
  animalSprite.addAnimation("normal", max_image, max_image); 
  
  animalSprite2 = createSprite(124,84, 300, 300); 
  turtle_image.resize(124,84); 
  animalSprite2.addAnimation("normal", turtle_image, turtle_image); 

  animalSprite3 = createSprite(113,109, 953, 99); 
  cat_image.resize(113,109); 
  animalSprite3.addAnimation("normal", cat_image, cat_image); 

  animalSprite4 = createSprite(108,138, 70, 212); 
  bunny_image.resize(108,138); 
  animalSprite4.addAnimation("normal", bunny_image, bunny_image); 

  animalSprite5 = createSprite(289,184, 354, 533); 
  buddy_image.resize(289,184); 
  animalSprite5.addAnimation("normal", buddy_image, buddy_image); 

  animalSprite6 = createSprite(111,88, 241, 176); 
  pig_image.resize(111,88); 
  animalSprite6.addAnimation("normal", pig_image, pig_image); 

  animalSprite7 = createSprite(106,102, 162, 320); 
  mouse_image.resize(106,102); 
  animalSprite7.addAnimation("normal", mouse_image, mouse_image); 
  
  // every animation needs a descriptor, since we aren't switching animations, this string value doesn't matter
  
  

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);
  adventureManager.setOtherPlayerSprite(animalSprite7);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();
  // adding to animalMap and CoordinateMap 
  adventureManager.addToMap(animalSprite,"Dog Park"); 
  adventureManager.addToCoordinateMap(animalSprite, 730,326); 
  adventureManager.addToMap(animalSprite2,"Lake"); 
  adventureManager.addToCoordinateMap(animalSprite2, 596,576); 

  adventureManager.addToMap(animalSprite3,"Fountain"); 
  adventureManager.addToCoordinateMap(animalSprite3, 953,99); 
  adventureManager.addToCSMap(animalSprite3, "Challenge Three");

  adventureManager.addToMap(animalSprite4,"Flower Garden"); 
  adventureManager.addToCoordinateMap(animalSprite4, 70,212); 
  adventureManager.addToCSMap(animalSprite4, "Challenge Two"); 

  adventureManager.addToMap(animalSprite5,"Park Bench"); 
  adventureManager.addToCoordinateMap(animalSprite5, 354,533);
  adventureManager.addToCSMap(animalSprite5, "Challenge Four");

  adventureManager.addToMap(animalSprite6,"Child Park"); 
  adventureManager.addToCoordinateMap(animalSprite6, 241,176);
  
  adventureManager.addToMap(animalSprite7,"Crosswalk 2"); 
  adventureManager.addToCoordinateMap(animalSprite7, 162,320);
  adventureManager.addToCSMap(animalSprite7, "Challenge Five");

  timer = new Timer(1000); 

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();

  // No avatar for Splash screen or Instructions screen
  if( adventureManager.getStateName() !== "Start" && 
      adventureManager.getStateName() !== "Instruction" && 
      adventureManager.getStateName() !== "Challenge One" &&
      adventureManager.getStateName() !== "Challenge Two" &&
      adventureManager.getStateName() !== "Operation Carrot" &&
      adventureManager.getStateName() !== "Challenge Three" &&
      adventureManager.getStateName() !== "Operation Raindrop" &&
      adventureManager.getStateName() !== "Challenge Four" &&
      adventureManager.getStateName() !== "Operation Tennis Ball" &&
      adventureManager.getStateName() !== "Challenge Five" &&
      adventureManager.getStateName() !== "Operation Cheese Maze" &&
      adventureManager.getStateName() !== "Win") {
      
    // responds to keydowns
    moveSprite();

    // this is a function of p5.js, not of this sketch
    drawSprite(playerSprite);
  } 

  if(adventureManager.getStateName() === "Challenge Five") {
    animalSprite7.position.x = 751; 
    animalSprite7.position.y = 642; 
  }

   if( adventureManager.getStateName() !== "Start" && 
      adventureManager.getStateName() !== "Instruction" && 
      adventureManager.getStateName() !== "Challenge One" &&
      adventureManager.getStateName() !== "CrossRoads" &&
      adventureManager.getStateName() !== "Challenge Two" &&
      adventureManager.getStateName() !== "Operation Carrot" &&
      adventureManager.getStateName() !== "Challenge Three" &&
      adventureManager.getStateName() !== "Operation Raindrop" &&
      adventureManager.getStateName() !== "Challenge Four" &&
      adventureManager.getStateName() !== "Operation Tennis Ball" &&
      adventureManager.getStateName() !== "Challenge Five" &&
      adventureManager.getStateName() !== "Operation Cheese Maze" &&
      adventureManager.getStateName() !== "Win") {
      
    // responds to keydowns
    
    textFont(puppyFont);
    textSize(40);
    // strokeWeight(10); 
    textAlign(LEFT);
    textStyle(BOLD); 
    fill("black"); 
    rect(width-360, 40, 350, 40);
    fill("red");
    text( "Animals Collected: " + adventureManager.getCollected() + "/7", width-350, 70);
    textAlign(RIGHT);
    fill("black"); 
    rect(width-1260, 40, 420, 40);
    fill("red");
    text( "Challenges Completed: " + challengesCompleted + "/5", width-850, 70 );

    // this is a function of p5.js, not of this sketch
  } 

  if(adventureManager.getCollected() === 7 && challengesCompleted === 5) {
    adventureManager.changeState("Win"); 
  }
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch key events for adventure manager to move from state to 
  // state or do special actions - this can be disabled for NPC conversations
  // or text entry   

  // dispatch to elsewhere
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//
function moveSprite() {
  if(keyIsDown(RIGHT_ARROW)) {
    playerSprite.velocity.x = 10;
    playerSprite.mirrorX(1); 
    // playerSprite.changeAnimation('right');
  }
  else if(keyIsDown(LEFT_ARROW)){
    // playerSprite.changeAnimation('left'); 
    playerSprite.velocity.x = -10;
    playerSprite.mirrorX(-1); 
  }
  else
    playerSprite.velocity.x = 0;

  if(keyIsDown(DOWN_ARROW))
    playerSprite.velocity.y = 10;
  else if(keyIsDown(UP_ARROW))
    playerSprite.velocity.y = -10;
  else
    playerSprite.velocity.y = 0;
}

function moveMouse() {
  if(keyIsDown(RIGHT_ARROW)) {
    animalSprite7.velocity.x = 10;
    animalSprite7.mirrorX(-1); 
    // playerSprite.changeAnimation('right');
  }
  else if(keyIsDown(LEFT_ARROW)){
    // playerSprite.changeAnimation('left'); 
    animalSprite7.velocity.x = -10;
    animalSprite7.mirrorX(1); 
  }
  else
    animalSprite7.velocity.x = 0;

  if(keyIsDown(DOWN_ARROW))
    animalSprite7.velocity.y = 10;
  else if(keyIsDown(UP_ARROW))
    animalSprite7.velocity.y = -10;
  else
    animalSprite7.velocity.y = 0;
}

function moveBunny() {
  animalSprite4.velocity.x = (mouseX - animalSprite4.position.x)/10; 
  animalSprite4.velocity.y = (mouseY - animalSprite4.position.y)/10; 
}

function moveKitty() {
  if(keyIsDown(RIGHT_ARROW)) {
    animalSprite3.velocity.x = 10;
    animalSprite3.mirrorX(-1); 
    // playerSprite.changeAnimation('right');
  }
  else if(keyIsDown(LEFT_ARROW)){
    // playerSprite.changeAnimation('left'); 
    animalSprite3.velocity.x = -10;
    animalSprite3.mirrorX(1); 
  }
  else
    animalSprite3.velocity.x = 0;
}

//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#00000000";
  this.noTint = false;
  this.tint = "#00000000"; 
  if(this.otherImage != null) {
    this.setImage(this.otherImage); 
  }
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#00000000";
  this.setImage(this.originalImage); 
}

clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}



//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

class challengeOne extends PNGRoom {

  preload() {
    yellowCar = loadImage("assets/yellow car.png"); 
    yellowCar2 = loadImage("assets/yellow car2.png");  
   
  }
 
  draw() {

    if(changeState) {
      playerSprite.position.x = 0;
      playerSprite.position.y = 75; 

      changeState = false; 
      yellowCar.resize(70,100);
      yellowCar2.resize(70,100); 

      var car = createSprite(290, 800);
      car.addAnimation('normal',yellowCar,yellowCar);  
      cars.add(car); 
      
      car = createSprite(700, 800); 
      car.addAnimation('normal',yellowCar,yellowCar);  
      cars.add(car);

      car = createSprite(1120, 800); 
      car.addAnimation('normal',yellowCar,yellowCar);  
      cars.add(car);

      car = createSprite(160, 0); 
      car.addAnimation('normal',yellowCar2,yellowCar2); 
      cars2.add(car); 

      car = createSprite(580, 0); 
      car.addAnimation('normal',yellowCar2,yellowCar2); 
      cars2.add(car);

      car = createSprite(980, 0); 
      car.addAnimation('normal',yellowCar2,yellowCar2); 
      cars2.add(car);
    }
    
    super.draw(); 

    for(var i = 0; i < cars.length; i++){
      var sprite = cars[i]; 
      if(sprite.position.y === 800) {
        sprite.addSpeed(random(1,6), 270); 
      }
  
      if(sprite.position.y < 0){
        sprite.position.y = 750; 
      }
      if(playerSprite.collide(sprite)) {
        playerSprite.position.x = 0; 
      }
    }

    for(var i = 0; i < cars2.length; i++){
      var sprite = cars2[i];  
      if(sprite.position.y === 0) {
        sprite.addSpeed(random(3,6), 90); 
      }
  
      if(sprite.position.y > 750){
        sprite.position.y = 1; 
      }

      if(playerSprite.collide(sprite)) {
        playerSprite.position.x = 0; 
      }
    }
    if(playerSprite.position.x > 1240) {
      challengesCompleted+=1; 
      adventureManager.changeState("Crosswalk"); 
      changeState = true; 
    }
    drawSprites(cars);
    drawSprites(cars2);  
  }
}

class crosswalk extends PNGRoom {

  draw() {
    if(changeState) {
      playerSprite.position.y = 300; 
      playerSprite.position.x = 260; 
      changeState = false; 
    }
    super.draw(); 
    
    if(playerSprite.position.x > 300 && playGame) {
      print("Changing State"); 
      changeState = true; 
      playGame = false; 
      adventureManager.changeState("Challenge One"); 
    }
  }
}


function collect(sprite) {
  sprite.remove(); 
  carrots = carrots + 1; 
}

class operationCarrot extends PNGRoom {

  preload() {
    // load the animation just one time
    // this.NPCAnimation = createSprite(28,44, 300, 300);
    //this.NPCAnimation.addAnimation("normal", carrot, carrot);
   // this is a type from p5play, so we can do operations on all sprites
   // at once
    this.NPCgroup = new Group;

   // change this number for more or less
    this.numNPCs = 100;

   // is an array of sprites, note we keep this array because
   // later I will add movement to all of them
    this.NPCSprites = [];

   // this will place them randomly in the room
    for( let i = 0; i < this.numNPCs; i++ ) {
     // random x and random y poisiton for each sprite
      let randX  = random(100, width-100);
      let randY = random(100, height-100);

     // create the sprite
      this.NPCSprites[i] = createSprite( randX, randY,120,143);
   
     // add the animation to it (important to load the animation just one time)
      this.NPCSprites[i].addAnimation('regular',  carrot, carrot);

     // add to the group
      this.NPCgroup.add(this.NPCSprites[i]);
   }

   print(this.NPCgroup); 
 }


  draw() {
    super.draw(); 
    drawSprite(animalSprite4); 
    moveBunny(); 
    fill("black"); 
    rect(width-560, 40, 425, 40);
    fill("red");
    textFont(puppyFont);
    textSize(40);
    textAlign(CENTER);
    textStyle(BOLD); 
    text( "Carrots Collected: " + carrots + "/100", width-350, 70);

    this.NPCgroup.draw();

    // checks for overlap with ANY sprite in the group, if this happens
    // our die() function gets called
    this.NPCgroup.overlap(animalSprite4, collect);

    for( let i = 0; i < this.NPCSprites.length; i++ ) {
      // this.NPCSprites[i].velocity.x = random(-3,1);
      this.NPCSprites[i].velocity.y = random(-2,2);
    }

    if(carrots === 100) {
      adventureManager.changeState("Flower Garden"); 
      challengesCompleted+=1; 
    }
    
  }
}

function updateTimer() {
  if(timer.expired()) {
    seconds+=1; 
    timer.start(); 
  }
}

function collectYarn(sprite) {
  sprite.remove(); 
  yarn = yarn + 1; 
}

function collectRaindrop(sprite) {
  sprite.remove(); 
  yarn = yarn - 1; 
}

class operationRaindrop extends PNGRoom {

  preload() {

    this.yarnGroup = new Group(); 
    this.raindropGroup = new Group(); 
    seconds = 0; 
    
  }

  draw() {
    super.draw();  
    fill("black"); 
    rect(width-525, 40, 350, 40);
    fill("red");
    textFont(puppyFont);
    textSize(40);
    textAlign(CENTER);
    textStyle(BOLD); 
    text( "Yarn Collected: " + yarn + "/10", width-350, 70);

   
    drawSprite(animalSprite3); 
    animalSprite3.position.y = 579;
    moveKitty(); 
    updateTimer(); 
    if(seconds %3 === 0) {

      let randX  = random(50, width-50);
     // create the sprite
      var yarn_ball = createSprite( randX, 0, 74,64);
     // add the animation to it (important to load the animation just one time)
      yarn_ball.addAnimation('regular',  yarnball, yarnball);
     // add to the group
      this.yarnGroup.add(yarn_ball);
      seconds+=1; 
    }

    if(seconds %2 === 0) {

      let randX  = random(50, width-50);
     // create the sprite
      var rain_drop = createSprite( randX, 0, 62,53);
     // add the animation to it (important to load the animation just one time)
      rain_drop.addAnimation('regular',  raindrop, raindrop);
     // add to the group
      this.raindropGroup.add(rain_drop);
      seconds+=1; 
    }

    for(var i = 0; i < this.raindropGroup.length; i++){
      var sprite = this.raindropGroup[i]; 
      sprite.velocity.y = 2; 
  
      if(sprite.position.y > height + 100){
        sprite.remove(); 
      }
    }

    for(var i = 0; i < this.yarnGroup.length; i++){
      var sprite = this.yarnGroup[i]; 
      sprite.velocity.y = 2; 
  
      if(sprite.position.y > height + 100){
        sprite.remove(); 
      }
    }

    if(yarn === 10) {
      adventureManager.changeState("Fountain"); 
      challengesCompleted+=1; 
    }
    this.yarnGroup.overlap(animalSprite3, collectYarn);
    this.yarnGroup.draw();
    this.raindropGroup.overlap(animalSprite3, collectRaindrop); 
    this.raindropGroup.draw(); 
  }
}

function collectTennisBall(sprite) {
  sprite.remove(); 
  tb = tb + 1; 
}

class operationTennisBall extends PNGRoom {

  preload() {

    this.tennisBalls = new Group(); 
    seconds = 0; 
    animalSprite5.position.y = 430;
    animalSprite5.position.x = 65; 
    animalSprite5.mirrorX(-1); 
    
  }

  draw() {
    super.draw();  
    fill("black"); 
    rect(width-560, 40, 420, 40);
    fill("red");
    textFont(puppyFont);
    textSize(40);
    textAlign(CENTER);
    textStyle(BOLD); 
    text( "Tennis Balls Collected: " + tb + "/10", width-350, 70);

    animalSprite5.velocity.y += gravity; 
    animalSprite5.position.x = 160; 

    if(animalSprite5.position.y > 500) {
      animalSprite5.velocity.y = 0; 
    }
    if(keyIsDown(UP_ARROW)) {
      // print("HERE"); 
      animalSprite5.velocity.y = -jump; 
    }

    drawSprite(animalSprite5); 

    updateTimer(); 
    if(seconds %3 === 0) {

      let randY  = random(30,400);
     // create the sprite
      var tennis_ball = createSprite(1290, randY, 84,74);
     // add the animation to it (important to load the animation just one time)
      tennis_ball.addAnimation('regular',  tennisBall, tennisBall);
     // add to the group
      this.tennisBalls.add(tennis_ball);
      seconds+=1; 
    }

    for(var i = 0; i < this.tennisBalls.length; i++){
      var sprite = this.tennisBalls[i]; 
      sprite.velocity.x = -4; 
  
      if(sprite.position.x < 0){
        sprite.remove(); 
      }
    }

    if(tb === 10) {
      adventureManager.changeState("Park Bench"); 
      challengesCompleted+=1; 
    }
  
    this.tennisBalls.overlap(animalSprite5, collectTennisBall); 
    this.tennisBalls.draw(); 
  }
}

function collectCheese(sprite) {
  sprite.remove(); 
  cheese = cheese + 1; 
}

class operationCheeseMaze extends PNGRoom {
  preload() {
    this.cheeses = new Group(); 

    
    var cheese_sprite = createSprite(1106, 590, 100,92);
    cheese_sprite.addAnimation('regular',  cheese_image, cheese_image);
    this.cheeses.add(cheese_sprite); 
    
    var cheese_sprite2 = createSprite(1156, 62, 100,92); 
    cheese_sprite2.addAnimation('regular',  cheese_image, cheese_image);
    this.cheeses.add(cheese_sprite2); 
    
    var cheese_sprite3 = createSprite(391, 377,100,92); 
    cheese_sprite3.addAnimation('regular',   cheese_image, cheese_image);
    this.cheeses.add(cheese_sprite3); 
    
    var cheese_sprite4 = createSprite(81, 615, 100,92); 
    cheese_sprite4.addAnimation('regular',  cheese_image, cheese_image);
    this.cheeses.add(cheese_sprite4); 
  }

  draw() {
    super.draw(); 
    fill("black"); 
    rect(width-525, 40, 350, 40);
    fill("red");
    textFont(puppyFont);
    textSize(40);
    textAlign(CENTER);
    textStyle(BOLD);

    text( "Cheese Collected: " + cheese + "/4", width-350, 70);
    mouse_image.resize(45,44); 
    drawSprite(animalSprite7);
    moveMouse();  
    this.cheeses.draw(); 
    this.cheeses.overlap(animalSprite7, collectCheese);
 
    if(cheese === 4) {
      adventureManager.changeState("Crosswalk 2"); 
      challengesCompleted+=1; 
    }
  }
}
