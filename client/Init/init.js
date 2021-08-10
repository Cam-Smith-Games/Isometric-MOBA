//create and add canvas to body of document
var canvas = document.createElement('canvas');
canvas.id = "mainCanvas";
// width/height set to size of screen in CSS
canvas.width = 1920;
canvas.height = 1080;
document.body.appendChild(canvas);
var context = canvas.getContext("2d");

var UIcanvas = document.createElement('canvas');
UIcanvas.id = "UICanvas";
UIcanvas.width = 1920;
UIcanvas.height = 1080;
document.body.appendChild(UIcanvas);
var UIcontext = UIcanvas.getContext("2d");

cameraPos = new vector(-canvas.width/2, -canvas.height/2);

// disable right clicking
canvas.oncontextmenu = function(e) {
    e.preventDefault();
};
UIcanvas.oncontextmenu = function(e) {
    e.preventDefault();
};

// DIRECTION CONSTANTS
DOWN = 0; DOWN_LEFT = 1; DOWN_RIGHT = 2; LEFT = 3; RIGHT = 4; UP = 5; UP_LEFT = 6; UP_RIGHT = 7;
// different direction positions for zombie
Z_LEFT = 0; Z_UPLEFT = 1; Z_UP = 2; Z_UPRIGHT = 3; Z_RIGHT = 4; Z_DOWNRIGHT = 5; Z_DOWN = 6; Z_DOWNLEFT = 7;
// ANIMAITON CONSTATS
STANDING = 0; WALKING = 1; RUNNING = 2; ATTACKING = 3; SWIPING = 4; BITING = 5; BLOCKING = 6; DYING = 7; CRITDYING = 8;

// LIST OF ENEMIES
var enemyList = [];


/*create menu canvas
var menu = document.createElement("canvas");
menu.id = "menu";
menu.width = canvas.width;
menu.height = canvas.height;
document.body.appendChild(menu);
var menuContext = menu.getContext("2d");*/

/*create tooltip canvas
var tooltipCanvas = document.createElement("canvas");
tooltipCanvas.id = "tooltipCanvas";
tooltipCanvas.width = canvas.width;
tooltipCanvas.height = canvas.height;
document.body.appendChild(tooltipCanvas);
var tooltipContext = tooltipCanvas.getContext("2d");*/












