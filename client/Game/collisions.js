//function to tell whether two things are touching (returns true if colliding)
function collision(first, second) {
	return 	first.x < second.x + second.width &&
			first.x + first.width > second.x &&
			first.y < second.y + second.height &&
			first.y + first.height > second.y
}

//function that checks for and handles collisions
function collisionChecker() {

}