var player = {
	// actual x/y vs screen x/y
	position: new vector(0, 0),
	center: function() { return new vector(this.position.x + this.width/2, this.position.y - this.height/2) },
	isoPos: new isoVector(this.position),
	velocity: new vector(0, 0),
	angle: 0,
	width: 50,
	height: 120,
	direction: DOWN,
	moving: false,
	moveSpeed: 500,
	attackTimer: 0,

	firstName: "Dopeboy",
	lastName: "Swaggington",

	// PLAYER STATS
	attackDamage: 30,
	attackSpeed: 4,
	attackRange: 400,
	critChance: 20,
	critModifier: 2,
	maxhp: 1000,
	maxmana: 1000,
	blinkDistance: 300,
	target: null,
	fireTimer: 0,

	hp: 1000,
	mana: this.maxmana,
	gold: 0,
	level: 1,
	experience: 0,
	expToLevel: 500,

	inventory: [],

	blinkTimer: 0,
	// animation stuff
	animationTimer: 0,
	xFrame: 0,
	yFrame: 0,
	state: WALKING,
	previousState: WALKING,
	frameDimensions: [],
	spriteDimensions: [],
	drawOffsets: [],
	imageWidths: [],
	images: [],
	
	getDirection: function() {
		if(this.angle < 22.5 || this.angle >= 337.5)
			return RIGHT;
		if(this.angle < 337.5 && this.angle >= 292.5)
			return UP_RIGHT;
		if(this.angle < 292.5 && this.angle >= 247.5)
			return UP;
		if(this.angle < 247.5 && this.angle >= 202.5)
			return UP_LEFT;
		if(this.angle < 202.5 && this.angle >= 157.5)
			return LEFT;
		if(this.angle < 157.5 && this.angle >= 112.5)
			return DOWN_LEFT;
		if(this.angle < 112.5 && this.angle >= 67.5)
			return DOWN;
	
		return DOWN_RIGHT;
	},
	
	setFrame: function() {
		if(this.previousState != this.state) {
			this.previousState = this.state;
			this.xFrame = 0;
		}
		if(this.moving || this.attacking) {
			this.direction = this.getDirection();
			if (this.animationTimer % 5 == 0) {
				this.xFrame = (this.xFrame+this.frameDimensions[this.state][0]) % this.imageWidths[this.state];
				this.animationTimer = 0;
				if(this.state == ATTACKING && this.xFrame == this.imageWidths[ATTACKING]-this.frameDimensions[ATTACKING][0]) {
					this.attacking = false;
					this.state = WALKING;
					this.target.hp -= this.attackDamage;
					console.log(this.target.hp);
				}
			}
			if(this.state == ATTACKING)
				this.animationTimer += this.attackSpeed;
			else
				this.animationTimer++;
		}
		else
			this.xFrame = 0;
	},
	move: function() {
		if(this.blinkTimer > 0)
			this.blinkTimer--;
		if(this.fireTimer > 0)
			this.fireTimer--;


		if(mouse.clicked && !this.attacking) {
			// calculate unit vectors for movement, then scale with move speed
			var distance = this.position.findDistance(mouse.position);
			var unitX = (mouse.position.x - this.position.x) / distance;
			var unitY = (mouse.position.y - this.position.y) / distance;
			if(this.approachingEnemy) {
				if(distance < this.attackRange) {
					this.attack(this.target);
					return;
				}
			}
			if (distance < 10) {
				this.velocity = 0;
				this.moving = false;
				mouse.clicked = false;
			}
			else {
				this.moving = true;
				this.velocity = new vector(unitX * this.moveSpeed, unitY * this.moveSpeed);
				this.position.x += (this.velocity.x / 100);
				this.position.y += (this.velocity.y / 100);
			}
			this.angle = Math.atan2(mouse.position.y - player.position.y, mouse.position.x - player.position.x) * 180/Math.PI;
			if(this.angle < 0)
				this.angle += 360;
		}

	},

	draw: function() {
		if(isOnCamera(this)) {
			// drawing hitbox
			//context.fillRect(this.position.x-this.width/2, this.position.y-this.height, this.width, this.height);

			// advancing frame and drawing animation
			this.setFrame();
			context.drawImage(this.images[this.state], this.xFrame, this.direction*this.frameDimensions[this.state][1], // img, sx, sy
				this.frameDimensions[this.state][0], this.frameDimensions[this.state][1], 								// frame width/height
				this.position.x - this.drawOffsets[this.state][0], this.position.y - this.drawOffsets[this.state][1], 	// x, y
				this.spriteDimensions[this.state][0], this.spriteDimensions[this.state][1]);							// width, height

			// DRAWING BLINK/ATTACK RANGES
			context.save();
			context.transform(1, 0.5, -1, 0.5, 0, 0);
			context.beginPath();
			context.strokeStyle = "white";
			context.arc(0.5 * this.position.x + this.position.y, this.position.y - 0.5 * this.position.x, this.blinkDistance, 0, Math.PI * 2);
			context.stroke();
			context.beginPath();
			context.strokeStyle = "red";
			context.arc(0.5 * this.position.x + this.position.y, this.position.y - 0.5 * this.position.x, this.attackRange, 0, Math.PI * 2);
			context.stroke();
			context.restore();

			context.fillStyle = context.strokeStyle = "rgb(100, 170, 255)";
			context.font = "15px Arial";
			// DRAWING PLAYER POSITION DOT
			context.fillRect(this.position.x - 5, this.position.y - 5, 10, 10);
			// DRAWING MOUSE CLICK POS
			context.fillRect(mouse.position.x, mouse.position.y, 10, 10);
			context.beginPath();
			context.moveTo(player.position.x, player.position.y);
			context.lineTo(mouse.position.x, mouse.position.y);
			context.stroke();

			context.fillStyle = "white";
			context.fillText("("+Math.round(mouse.position.x)+","+Math.round(mouse.position.y)+")", mouse.position.x-10, mouse.position.y-10);

			if(this.state == ATTACKING)
				context.fillRect(this.target.center().x-2.5, this.target.center().y-2.5, 5, 5);
			
			// drawing move info
			//context.fillText("(" + Math.round(this.position.x) + "," + Math.round(this.position.y) + ")", this.position.x - this.width / 2, this.position.y - this.height - 10);
		}
	},

	attack: function(enemy) {
		this.approachingEnemy = false;
		this.target = enemy;
		this.attacking = true;
		this.moving = false;
		this.state = ATTACKING;
		mouse.clicked = false;
		var center = this.center();
		var enemyCenter = enemy.center();
		this.angle = Math.atan2(enemyCenter.y - this.position.y, enemyCenter.x - this.position.x) * 180/Math.PI;
		if(this.angle < 0)
			this.angle += 360;
	},
	approachEnemy: function(enemy) {
		mouse.position = enemy.center();
		this.target = enemy;
		this.approachingEnemy = true;
	}
};

player.images[WALKING] = archerWalk;
player.images[ATTACKING] = archerAttack;

player.frameDimensions[WALKING] = [185, 206];
player.frameDimensions[ATTACKING] = [208, 268];

player.spriteDimensions[WALKING] = [123, 137];
player.spriteDimensions[ATTACKING] = [138, 178];

player.imageWidths[WALKING] = 2590;
player.imageWidths[ATTACKING] = 3328;

player.drawOffsets[WALKING] = [player.width * 1.2, player.height];
player.drawOffsets[ATTACKING] = [player.width * 1.3, player.height * 1.3];

function drawOtherPlayers() {
	for (var i = 0; i < playerList.length; i++) {
		var person = playerList[i];
		//console.log(person.position);
		if (isOnCamera(person) && person.id != player.id && person.xFrame != null) {
			//context.fillRect(person.position.x - player.width/2, person.position.y - player.height/2, player.width, player.height);
			context.drawImage(player.images[person.state], person.xFrame, person.direction*player.frameDimensions[person.state][1],
				player.frameDimensions[person.state][0], player.frameDimensions[person.state][1],
				person.position.x - player.drawOffsets[person.state][0], person.position.y - player.drawOffsets[person.state][1],
				player.spriteDimensions[person.state][0], player.spriteDimensions[person.state][1]);
		}
	}
}
//function that advances player to next level
function playerLeveler() {
	if(player.experience >= player.expToLevel) {
		//find difference between exp and exp to level
		//(this way if player overlevels, it is carried over to next level)
		var difference = player.experience - player.expToLevel;
		player.experience = difference;
		//every levels exp requirement is increased level*500; 
		player.expToLevel+=player.level*500;
		player.level++;

	}
}
