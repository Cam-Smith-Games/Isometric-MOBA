function fire(position) {
    this.position = position;
    this.frame = 0;
    this.width = 64;
    this.height = 64;
    this.timer = 200;
}

fireList = [];

function shootFire(position, angle, count) {
    fireList.push(new fire(position));
    var newPos = new vector(position.x + Math.cos(angle)*50, position.y + Math.sin(angle)*50);
    count++;

    //recursively create another fire in this angle until count = 10
    if(count < 10)
        setTimeout(function() {
            shootFire(newPos, angle, count)
        }, 50);
}




