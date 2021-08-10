function Grave(x, y, direction) {
    this.position = new vector(x, y);
    this.width = 25;
    this.height = 25;
    this.frame = 0;
    this.direction = direction;
    this.timer = 0;
    this.respawnTimer = 0;
}

graveList = [];
graveList[0] = new Grave(100, 100, Z_DOWN);
