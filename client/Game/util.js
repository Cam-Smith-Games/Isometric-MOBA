// simple vector class to hold x,y cordinates in one data structure
function vector(x, y) {
    this.x = x;
    this.y = y;
    this.point = function() {
        return [this.x, this.y];
    };
    this.add = function(temp) {
        this.x += temp.x;
        this.y += temp.y;
    };
    this.findDistance = function(temp) {
        var x = Math.pow(temp.x - this.x, 2);
        var y = Math.pow(temp.y - this.y, 2);
        // distance = sqrt( (x2 - x1)^2  + (y2 - y1)^2 )
        return Math.sqrt(x + y);
    }
}

function isoVector(x, y) {
    return _2DtoIso(new vector(x,y));
}


// SCREEN = ACTUAL
// WORLD = ISO
//var xScreen = xWorld + (yWorld * -1);
//var yScreen = xWorld * 0.5 + yWorld * 0.5;
//var xWorld = 0.5*xScreen + yScreen;
//var yWorld = yScreen - 0.5*xScreen


function _2DtoIso(point) {
    temp = new vector(0,0);
    temp.x = 0.5*point.x + point.y;
    temp.y = point.y - 0.5*point.x;
    return temp;
}
// convert isometric coordinate to cartesian coordinate
function isoTo2D(point) {
    var temp = new vector(0, 0);
    temp.x = point.x - point.y;
    temp.y = (point.x + point.y)/2;
    //temp.x = (2 * point.y + point.x) / 2;
    //temp.y = (2 * point.y - point.x) / 2;
    return temp;
}

function getTileCoordinates(point, tileHeight) {
    temp = new vector(0, 0);
    temp.x = Math.floor(point.x / tileHeight);
    temp.y = Math.floor(point.y / tileHeight);
    return temp;
}


function mapToScreenPos(point) {
    return new vector(point.x + cameraPos.x, point.y + cameraPos.y);
}
function screenToMapPos(point) {
    return new vector(point.x - cameraPos.x, point.y + cameraPos.y);
}



function isOnCamera(object) {
    // padding to draw things slightly off screen
    var padding = 200;
    // obj left > camera left && object left < camera right  ||||| object right > camera left && object right < camera right
    // AND
    // obj top < camera top && object top > camera bottom |||| obj bottom > camera top && object bottom < camera bottom
    return  ((object.position.x > cameraPos.x-padding && object.position.x < cameraPos.x + canvas.width+padding)
            || (object.position.x + object.width > cameraPos.x-padding && object.position.x + object.width < cameraPos.x + canvas.width+padding))
            &&
            ((object.position.y < cameraPos.y+canvas.height+padding && object.position.y > cameraPos.y-padding) ||
            (object.position.y+object.height < cameraPos.y+canvas.height+padding && object.position.y+object.height > cameraPos.y-padding))
}

