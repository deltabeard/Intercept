// Global variables
var inputDirection = null;              // Stores the direction the actor is to move next
var speed = 3;                          // This is the number of pixels the actor will move each frame
var start = false;                      // If the game has started or not
var tileSize = 12;                      // Size of game tiles/grid spacing
var xTiles = 80;                        // Number of Tiles horizontally
var yTiles = 50;                        // Number of Tiles vertically
var canvasWidth = tileSize * xTiles;
var canvasHeight = tileSize * yTiles;
var grid = new Array(xTiles);           // Relative grid coordinates game is played on.
for(var i=0;i<xTiles;i++){
    grid[i] = new Array(yTiles);
}

//Game Variables
var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, 'intercept-canvas', {
    preload: preload, create: create, update: update, render: render});

// Player
var actor;
var trail;      // The trail left behind actor

function preload() {
    // Assets that will be preloaded will go here.
    game.load.image('actor', 'assets/img/blueBike1.png');
    game.load.image('background', 'assets/img/backgroundTile12.png');
}

function create() {
    // This loads and tiles the background image
    game.add.tileSprite(0,0,canvasWidth,canvasHeight,'background');
    // Sets up the trail.
    trail = game.add.graphics(0,0);
    trail.lineStyle(3,0x3498DB,1);
    trail.boundsPadding = 0;
    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    actor = game.add.sprite(canvasWidth/2, canvasHeight/2, 'actor');
    actor.anchor.x = 0.5;
    actor.anchor.y = 0.5;
    actor.scale.x = 0.3;
    actor.scale.y = 0.3;

    //Keyboard Events
    // Pausing game
    game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function() {
        game.paused = !game.paused;
    });

    // Movement keys
    game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function() {
        if(actor.angle != -180) {
            inputDirection = 0;
            whenStarted();
        }
    });
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function() {
        if(actor.angle != 0) {
            inputDirection = -180;
            whenStarted();
        }
    });
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(function() {
        if(actor.angle != 90) {
            inputDirection = -90;
            whenStarted();
        }
    });
    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(function() {
        if(actor.angle != -90) {
            inputDirection = 90;
            whenStarted();
        }
    });
}
function update() {
    // Updated every frame
    if (start) {
        var x = Math.floor(actor.x/tileSize);
        var y = Math.floor(actor.y/tileSize);
        // Main game code
        if(actor.x % tileSize == 0 && actor.y % tileSize == 0) {
            if(grid[x][y]){
                start = false;
            }
            else{
                grid[x][y] = true;
                if (inputDirection != null) {
                    actor.angle = inputDirection;
                    inputDirection = null;
                }
            }
        }
        if(start) {
            switch (actor.angle) {
                case 0:
                    actor.y -= speed;
                    break;
                case 90:
                    actor.x += speed;
                    break;
                case -90:
                    actor.x -= speed;
                    break;
                case -180:
                    actor.y += speed;
                    break;
            }
            trail.lineTo(actor.x, actor.y);
            if (!outOfBounds(actor)) {
                start = false;
                //showGameOver();
            }
        }
    }
}

function render() {
    game.debug.spriteInfo(actor, 20, 400);

}

function outOfBounds(actor) {
    return actor.x > 0 && actor.x < canvasWidth && actor.y > 0 && actor.y < canvasHeight;
}

function whenStarted() {
    if(!start) {
        start = true;
        trail.moveTo(actor.x, actor.y);
    }
}