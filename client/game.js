// game attributes
var game = {
	keypressTimer: 0,
	frameRate: 1000/30,
	developerMode: true,
	fps: 0,
	frameCount: 0
};


function update(){
	// decrement keypress timer for delaying key press toggles
	if(game.keypressTimer > 0) {
		game.keypressTimer--;
	}
	keyListener();
/*
	cheats();
	collisionChecker();
	uiUpdater();
	playerBlinker();
	worldGenerator();
	timeStopper();
	playerCopySpawner();
	npcRoamer();
	dummyMover();
	playerLeveler();
	itemCooldownUpdater();
 	enemyMover();
 	bulletMover();
*/
	player.move();
	updateEnemies();

	socket.emit('updatePlayer', {
		id: player.id,
		position: player.position,
		state: player.state,
		xFrame: player.xFrame,
		direction: player.direction
	})
}


function render(){
	//save contexts current coordinate system (from center of screen)
	context.save();
	//translate to offset
	context.translate(-cameraPos.x, -cameraPos.y);
	context.fillStyle = "black";
	context.fillRect(cameraPos.x, cameraPos.y, canvas.width, canvas.height);
	
	drawTiles();

	
	for(var i=0; i<fireList.length; i++) {
		var fire = fireList[i];
		fire.timer--;
		if(fire.timer % 5 == 0) {
			fire.frame = (fire.frame+1)%13;
		}
		if(fire.timer > 0) {
			context.drawImage(fireIMG, fire.frame * 128, 0, 128, 128, fire.position.x-32, fire.position.y-64, 128, 128);
		}
		else {
			fireList.splice(i, 1);
			delete fire;
		}
	}
	context.fillStyle = "red";
	for(var i=0; i<graveList.length; i++) {
		var grave = graveList[i];
		// draw last frame when the grave is "broken"
		var frame = grave.respawnTimer > 0 ? 23 : grave.frame;
		//context.fillRect(grave.position.x-grave.width/2, grave.position.y-grave.height/2, grave.width, grave.height);
		context.drawImage(graveIMG, frame*128, grave.direction*128, 128, 128, grave.position.x-64, grave.position.y-95, 128, 128);
		// when timer reaches zero and not respawning
		if(grave.timer == 0 && grave.respawnTimer <= 0) {
			grave.frame = (grave.frame+1)%24;
			// break when animation finished
			if(grave.frame == 0) {
				createZombie(grave.position.x-64, grave.position.y-128)
				grave.respawnTimer = 1500;
			}
		}
		if(grave.respawnTimer > 0)
			grave.respawnTimer--;
		else
			grave.timer = (grave.timer+1)%7;

	}

	
	drawEnemies();
	player.draw();
	drawOtherPlayers();

	// draw all npcs in list and their nameplates
	//for(i=0; i<npcList.length; i++) {
	//	npcList[i].draw();
	//}
	//drawCombatText();
	// put hud in separate canvas so it doesnt have to been redrawn?
	// drawHud();
	// menuUpdater();
	// minimapDrawer();
	// toolTipUpdater();
	// if near death, bloodyScreen();




	// drawing text
	context.fillStyle = "white";
	context.font = "30px Arial";
	pos = mapToScreenPos(new vector(canvas.width-100, canvas.height-20));
	context.fillText("fps:"+game.fps, pos.x, pos.y);
	pos = mapToScreenPos(new vector(canvas.width-450, canvas.height-20));
	context.fillText("camPos: (" + cameraPos.x + "," + cameraPos.y +")", pos.x, pos.y);
	pos = mapToScreenPos(new vector(canvas.width-700, canvas.height-20));
	context.fillText("# players: " + playerList.length, pos.x, pos.y);

	// keeping track of (0,0) coordinate
	context.font = "15px Arial";
	context.fillText("(0,0)", -15, -10);
	context.fillStyle = "red";
	context.fillRect(-2.5, -2.5, 5, 5);

	context.restore();
	// count fps
	game.frameCount++;

	renderUI();
}



