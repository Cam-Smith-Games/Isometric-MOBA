//world object
var world = {
	width: 10000,
	height: 10000
};


var minimap = {
	diameter: canvas.width/8,
	x: 0,
	y: 0
};

//function that draw minimap
function minimapDrawer() {
	minimap.x = -xOffset-canvas.width/2 + 32;
	minimap.y = -yOffset-canvas.height/2 + 20;
	//draw background for minimap
	context.drawImage(minimapIMG, minimap.x, minimap.y, minimap.diameter, minimap.diameter);
	//draw players dot in center of minimap
	context.drawImage(npcDotIMG, minimap.x + minimap.diameter/2 - 10, minimap.y + minimap.diameter/2 - 10, 20, 20);

	/*draw all enemies on minimap
	for(i=0; i<enemyList.length; i++) {
		var distance = Math.sqrt(Math.pow(player.x-enemyList[i].x, 2) + Math.pow(player.y-enemyList[i].y, 2));
		if(distance < 1.5*canvas.width) {
			var xDiff = player.x - enemyList[i].x;
			var yDiff = player.y - enemyList[i].y;
			//find new coordinates for each enemy square on minimap
			var newX = minimap.x + minimap.diameter/2 - 0.0325*xDiff - 10;
			var newY = minimap.y + minimap.diameter/2 - 0.0325*yDiff - 15;
			context.drawImage(enemyDotIMG, newX, newY, 20, 20);
		}
	}*/
}




