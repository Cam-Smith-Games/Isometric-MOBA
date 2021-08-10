// KEY CONSTANTS
K_W = 87; K_A = 65; K_S = 83; K_D = 68;
K_UP = 38; K_DOWN = 40; K_LEFT = 37; K_RIGHT = 39;
K_Q = 81; K_R = 82; K_TILDA = 192;

var keysPressed = [];
window.addEventListener("keydown", function(e) {
	keysPressed[e.keyCode] = true;
});
window.addEventListener("keyup", function(e) {
	delete keysPressed[e.keyCode];
});

// right click -> move
var mouse = {
	position: new vector(canvas.width/2, canvas.height/2),
	clicked: false,
	hoverPos: new vector(canvas.width/2, canvas.height/2),
	width: 10,
	height: 10,
	leftClicked: false
};

window.addEventListener('mousedown', function(e) {
	// if right click
	if (e.button == 2) {
		// scaling mouse click position with canvas dimensions
		mouse.position = new vector((e.pageX*canvas.width/window.innerWidth) + cameraPos.x, (e.pageY*canvas.height/window.innerHeight) + cameraPos.y);
		player.velocity = new vector(mouse.position.x - player.position.x, mouse.position.y - player.position.y);
		mouse.clicked = true;
		for(var i=0; i<enemyList.length; i++) {
			if(enemyList[i].collidesWith(mouse)) {
				var playerCenter = new vector(player.position.x, player.position.y - player.height/2);
				if(playerCenter.findDistance(enemyList[i].position) <= player.attackRange)
					player.attack(enemyList[i]);
				else
					player.approachEnemy(enemyList[i]);
				return
			}
		}
		// if no enemy clicked, stop approaching enemy
		player.approachingEnemy = false;
	}
	if (e.button == 0) {
		mouse.leftClicked = true;
	}
});

window.addEventListener('mouseup', function(e){
	if (e.button == 0)
		mouse.leftClicked = false;
});

window.addEventListener('mousemove', function(e) {
	//mousePos.x = e.pageX * canvas.width/window.innerWidth + cameraPos.x - 3;
	//mousePos.y = e.pageY * canvas.width/window.innerWidth + cameraPos.y - 37;
	mouse.hoverPos.x = e.pageX;
	mouse.hoverPos.y = e.pageY;
});

// might need to change for non-firefox
window.addEventListener('wheel', function(e) {
	if(e.deltaY < 0) {
		context.scale(2,2);
	}
	else {
		context.scale(0.5, 0.5);
		cameraPos.x *= 1/2;
		cameraPos.y *= 1/2;
	}
});

function keyListener() {
	/*
	if(mouse.hoverPos.x * canvas.width/window.innerWidth > canvas.width*0.95)
		cameraPos.x += 10;
	if (mouse.hoverPos.x * canvas.width / window.innerWidth < canvas.width * 0.05)
		cameraPos.x -= 10;
	if (mouse.hoverPos.y * canvas.height / window.innerHeight > canvas.height * 0.95)
		cameraPos.y += 10;
	if (mouse.hoverPos.y * canvas.height / window.innerHeight < canvas.height * 0.05)
		cameraPos.y -= 10;
	*/

	if (keysPressed[K_D] && player.blinkTimer == 0) {
		// convert mouse screen coords to map coords
		var mousePos = new vector(mouse.hoverPos.x * canvas.width / window.innerWidth + cameraPos.x, mouse.hoverPos.y * canvas.height / window.innerHeight - cameraPos.y);
		// calculate unit vectors for movement, then scale with blink speed
		var distance = player.position.findDistance(mousePos);
		var unitX = (mousePos.x - player.position.x) / distance;
		var unitY = (mousePos.y - player.position.y) / distance;
		if (distance < player.blinkDistance)
			player.position.add(new vector(unitX * distance, unitY * distance));
		else
			player.position.add(new vector(unitX * player.blinkDistance, unitY * player.blinkDistance));
		player.blinkTimer = 50;
		mouse.clicked = false;
	}

	if (keysPressed[K_Q] && player.fireTimer == 0) {
		console.log("left click");
		var hoverPos = new vector(mouse.hoverPos.x * canvas.width/window.innerWidth + cameraPos.x, mouse.hoverPos.y * canvas.height/window.innerHeight + cameraPos.y);
		var angle = Math.atan2(hoverPos.y - player.position.y, hoverPos.x - player.position.x);
		var pos = new vector(player.position.x-60 + 100*Math.cos(angle), player.position.y - 100 + 100*Math.sin(angle))
		shootFire(pos, angle, 0);
		player.fireTimer = 100;
	}
	if (keysPressed[K_W]) {
		player.angle = (player.angle+1) % 360;
	}

	if (keysPressed[K_UP])
		cameraPos.y -= 10;
	if (keysPressed[K_DOWN])
		cameraPos.y += 10;
	if (keysPressed[K_LEFT])
		cameraPos.x -= 10;
	if (keysPressed[K_RIGHT])
		cameraPos.x += 10;
	
}
//function for cheat commands
function cheats() {
	//using timer and setting 10 apart so user doesnt immediately turn developer mode back off / back on when pressed
	if(keys[K_TILDA] && !player.developerMode) {
		player.developerMode = true;
	}
	if(keys[K_TILDA] && player.developerMode) {
		player.developerMode = false;
	}
}

