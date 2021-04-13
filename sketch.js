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

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// indexes into the clickable array (constants)
const playGameIndex = 0;

var changeState; 
// make sure we only play crossy roads once 
var playGame = true; 
var cars; 
var yellowCar; 
var cars2; 
var yellowCar2; 

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
  chase_image = loadImage('assets/avatars/chase 1.png'); 
  chase_image_2 = loadImage('assets/avatars/chase 2.png'); 
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  cars = new Group(); 
  cars2 = new Group(); 

  // create a sprite and add the 3 animations
  playerSprite = createSprite(120, 94, 0, 720);
  playerSprite.position.y = 680; 
  playerSprite.position.x = 0; 

  // every animation needs a descriptor, since we aren't switching animations, this string value doesn't matter
  chase_image.resize(120,94); 
  chase_image_2.resize(120,94); 
  playerSprite.addAnimation('right', chase_image, chase_image);
  playerSprite.addAnimation('left', chase_image_2, chase_image_2);
  

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

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
      adventureManager.getStateName() !== "Challenge One") {
      
    // responds to keydowns
    moveSprite();

    // this is a function of p5.js, not of this sketch
    drawSprite(playerSprite);
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
    playerSprite.changeAnimation('right');
  }
  else if(keyIsDown(LEFT_ARROW)){
    playerSprite.changeAnimation('left'); 
    playerSprite.velocity.x = -10;
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
  // this.setImage(this.otherImage); 
  if(this.otherImage != null) {
    print("SETTING IMAGE"); 
    // let imageTemp = this.image; 
    this.setImage(this.otherImage); 
    // this.otherImage = imageTemp; 
  }
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#00000000";
  // print("ON THE OUTSIDE"); 
  this.setImage(this.originalImage); 
}

clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}



//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//


// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class InstructionsScreen extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  // preload() {
    // These are out variables in the InstructionsScreen class
    // this.textBoxWidth = (width/6)*4;
    // this.textBoxHeight = (height/6)*4; 

    // // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    // this.instructionsText = "You are navigating through the interior space of your moods. There is no goal to this game, but just a chance to explore various things that might be going on in your head. Use the ARROW keys to navigate your avatar around.";
  // }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
    // tint down background image so text is more readable
    // tint(128);
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text draw settings
    // fill(255);
    // textAlign(CENTER);
    // textSize(30);

    // Draw text in a box
    // text(this.instructionsText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
  }
}

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
      // chase_image.resize(75,55); 
      // chase_image_2.resize(75,55); 
      
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
        // print("HEREEEE");
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
      // chase_image.resize(158,122); 
      // chase_image_2.resize(158,122);
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
