UIcontext.font = "35px Times New Roman";
function renderUI() {

	UIcontext.fillStyle = "black";
	UIcontext.fillRect(canvas.width/2-250, canvas.height-100, 500, 100);

	UIcontext.fillStyle = "red";
	UIcontext.fillRect(canvas.width/2-250, canvas.height-100, (player.hp/player.maxhp)*500, 30);
	console.log(player.hp/player.maxhp);

	UIcontext.fillStyle = "black";
	UIcontext.drawImage(fireIcon, canvas.width/2-200, canvas.height-65, 60, 60);
	UIcontext.fillText("Q", canvas.width/2-185, canvas.height-25);
	if(player.fireTimer > 0) {
		UIcontext.fillStyle = "rgba(0, 0, 0, 0.5)";
		// fireTimer / max fireTimer possible
		var percent = player.fireTimer / 100;
		console.log(percent);
		UIcontext.fillRect(canvas.width/2-200, canvas.height-5-(60*percent), 60, 60*percent);
	}
}


