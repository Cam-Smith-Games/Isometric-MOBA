// healthbar class
function HealthBar(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

var Zombie = {
    name: null,
    position: new vector(0, 0),
    velocity: new vector(0, 0),
    angle: 0,
    direction: DOWN,
    width: 0,
    height: 0,

    center: function() {
        return new vector(this.position.x + this.width/2, this.position.y + this.height/2);
    },

    moving: false,
    attacking: false,
    moveSpeed: 200,
    attackTimer: 0,
    target: null,

    // COMBAT STATS
    attackDamage: 100,
    attackSpeed: 0,
    attackRange: 60,
    maxhp: 1000,
    hp: this.maxhp,
    // animation stuff
    animationTimer: 0,
    xFrame: 0,
    state: WALKING,
    previousState: WALKING,
    frames: [],

    getDirection: function() {
        if(this.angle < 22.5 && this.angle >= -22.5)
            return Z_RIGHT;
        if(this.angle < -22.5 && this.angle >= -67.5)
            return Z_UPRIGHT;
        if(this.angle < -67.5 && this.angle >= -112.5)
            return Z_UP;
        if(this.angle < -112.5 && this.angle >= -157.5)
            return Z_UPLEFT;
        if(this.angle < -157.5 || this.angle >= 157.5)
            return Z_LEFT;
        if(this.angle < 157.5 && this.angle >= 112.5)
            return Z_DOWNLEFT;
        if(this.angle < 112.5 && this.angle >= 67.5)
            return Z_DOWN;

        return Z_DOWNRIGHT;
    },

    collidesWith: function(object) {
        return  object.position.x < this.position.x + this.width &&
            object.position.x + object.width > this.position.x &&
            object.position.y < this.position.y + this.height &&
            object.height + object.position.y > this.position.y
    },

    move: function() {
        if(this.attackTimer > 0) {
            this.attackTimer--;
        }
        var playerCenter = player.center();
        var center = this.center();
        var distToPlayer = center.findDistance(playerCenter);
        if(distToPlayer < this.attackRange) {
            if(this.attackTimer == 0)
                this.attack(player);
        }
        else {
            this.state = WALKING;
            // calculate unit vectors for movement, then scale with move speed
            var unitX = (playerCenter.x - center.x) / distToPlayer;
            var unitY = (playerCenter.y - center.y) / distToPlayer;

            this.moving = true;
            this.velocity = new vector(unitX * this.moveSpeed / 100, unitY * this.moveSpeed / 100);
            this.position.add(this.velocity);
            this.angle = Math.atan2(playerCenter.y - center.y, playerCenter.x - center.x) * 180/Math.PI;
        }
    },

    attack: function(target) {
        this.target = target;
        this.moving = false;
        this.attacking = true;
        this.state = SWIPING;
    },

    setFrame: function() {
        var frames = this.frames[this.state];
        if(this.previousState != this.state) {
            this.previousState = this.state;
            this.xFrame = 0;
        }
        if(this.moving || this.attacking) {
            this.direction = this.getDirection();
            if (this.animationTimer % 8 == 0) {
                this.xFrame = (this.xFrame+1)%(this.frames[this.state].length);
                this.animationTimer = 0;
                // WHEN ATTACK FINISHED
                if((this.state == SWIPING || this.state == BITING) && this.xFrame == this.frames[this.state].length-1) {
                    this.attacking = false;
                    this.state = STANDING;
                    this.target.hp -= this.attackDamage;
                    this.attackTimer = 50;
                }
            }
            this.animationTimer++;
        }
        else
            this.xFrame = 0;
    },

    draw: function() {
        this.setFrame();
        //context.fillRect(this.position.x, this.position.y, this.width, this.height);
        context.drawImage(zombieIMG, this.frames[this.state][this.xFrame], this.direction*128, 128, 128, this.position.x-85, this.position.y-85, this.width*4, this.height*2.2);
        context.fillRect(this.position.x, this.position.y-25, this.hp, 10);

        for(var i=0; i<fireList.length; i++) {
            if(this.collidesWith(fireList[i]))
                this.hp -= 1;
        }
        /* DRAWING BLINK/ATTACK RANGES
         context.save();
         context.transform(1, 0.5, -1, 0.5, 0, 0);
         context.beginPath();
         context.strokeStyle = "red";
         var center = this.center();
         context.arc(0.5 * center.x + center.y, center.y - 0.5 * center.x, this.attackRange, 0, Math.PI * 2);
         context.stroke();
         context.restore();
         */
    }
};


// xframe positions for each animation (state)
Zombie.frames[STANDING] =   [0, 128, 256, 384];
Zombie.frames[WALKING] =    [512, 640, 768, 896, 1024, 1152, 1280, 1408];
Zombie.frames[SWIPING] =    [1536, 1664, 1792, 1920];
Zombie.frames[BITING] =     [2048, 2176, 2304, 2432];
Zombie.frames[BLOCKING] =   [2560, 2688];
Zombie.frames[DYING] =      [2816, 2944, 3072, 3200, 3328, 3456];
Zombie.frames[CRITDYING] =  [3584, 3712, 3840, 3968, 4096, 4224, 4352, 4480];


function createZombie(x, y) {
    var zombie = Object.create(Zombie);
    zombie.name = "Zombie";
    zombie.position = new vector(x, y);
    zombie.width = 60;
    zombie.height = 120;
    zombie.hp = 100;
    zombie.maxhp = 100;
    //zombie.img = function() { return callback(zombieIMG) };
    enemyList.push(zombie);
}
/*
for(var i=0; i<36; i++) {
    enemyList[i] = createZombie(Math.cos(10*i)*600, Math.sin(10*i)*600);
}*/


function updateEnemies() {
    for(var i=0; i<enemyList.length; i++)
        enemyList[i].move();
}
function drawEnemies() {
    context.fillStyle = "red";
    for(var i=0; i<enemyList.length; i++) {
        if(enemyList[i].hp <= 0) {
            enemyList.splice(i, 1);
        }
    }
    for(var i=0; i<enemyList.length; i++) {
        enemyList[i].draw();
    }
}

