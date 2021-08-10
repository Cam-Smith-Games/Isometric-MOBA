/**
 * Created by Cameron on 5/2/2016.
 */
function newImage(src) {
    var tmp = new Image();
    tmp.src = src;
    return tmp;
}

loadingIMG = newImage("client/img/loading.jpg");

archerWalk = newImage("client/img/archer/walk.png");
archerAttack = newImage("client/img/archer/attack.png");

grass = newImage("client/img/grass.jpg");

graveIMG = newImage("client/img/cursed_grave.png");
zombieIMG = newImage("client/img/zombie.png");

fireIMG = newImage("client/img/fire.png");
fireIcon = newImage("client/img/attacks/meteor.png");