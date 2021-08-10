// each tile 100x100
function Tile(x, y, weight) {
    this.isoPos = new vector(x, y);
    this.position = isoTo2D(this.isoPos);
    this.weight = weight;
    this.setNeighbor = function(dir, tile) {
        if(dir == "right") {
            this.rightNeighbor = tile;
            tile.leftNeighbor = this;
        }
        if(dir == "left") {
            this.leftNeighbor = tile;
            tile.rightNeighbor = this;
        }
        if(dir == "top") {
            this.topNeighbor = tile;
            tile.bottomNeighbor = this;
        }
        if(dir == "bottom") {
            this.bottomNeighbor = tile;
            tile.topNeighbor = this;
        }
    }
}

var tileGrid = [[]];
for(var i = -10; i<=15; i++) {
    tileGrid[i+10] = [];
    for(var j = -10; j<=15; j++) {
        var tile = new Tile(i*100, j*100, 1);
        tileGrid[i+10][j+10] = tile;
    }
}
for(var i=0; i<25; i++) {
    for(var j=0; j<25; j++) {
        if(i < 50)
            tileGrid[i][j].setNeighbor("right", tileGrid[i+1][j]);
        if(i > 1)
            tileGrid[i][j].setNeighbor("left", tileGrid[i-1][j]);
        if(j > 1)
            tileGrid[i][j].setNeighbor("top", tileGrid[i][j-1]);
        if(j < 50)
            tileGrid[i][j].setNeighbor("bottom", tileGrid[i][j+1]);
    }
}



function drawTiles() {
    context.save();
    context.transform(1, 0.5, -1, 0.5, 0, 0);
    context.fillStyle = "red";
    context.strokeStyle = "black";
    context.font = "15px Arial";
    for(var i=0; i<25; i++) {
        for(var j=0; j<25; j++) {
            if(isOnCamera(tileGrid[i][j]))
                context.drawImage(grass, tileGrid[i][j].isoPos.x, tileGrid[i][j].isoPos.y, 100, 100);
        }
    }

    context.strokeStyle = "yellow";
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.beginPath();

    context.moveTo(0, 0);
    context.lineTo(0, 100);
    context.lineTo(10, 80);
    context.lineTo(-10, 80);
    context.lineTo(0, 100);
    context.fillText("y", -5, 120);

    context.moveTo(0, 0);
    context.lineTo(0, -100);
    context.lineTo(10, -80);
    context.lineTo(-10, -80);
    context.lineTo(0, -100);
    context.fillText("-y", -5, -113);

    context.moveTo(0, 0);
    context.lineTo(100, 0);
    context.lineTo(80, 10);
    context.lineTo(80, -10);
    context.lineTo(100, 0);
    context.fillText("x", 110, 5);

    context.moveTo(0, 0);
    context.lineTo(-100, 0);
    context.lineTo(-80, 10);
    context.lineTo(-80, -10);
    context.lineTo(-100, 0);
    context.fillText("-x", -122, 5);

    context.stroke();

    context.restore();



}