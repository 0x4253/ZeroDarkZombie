function MenuKeypressListener(event) {
	//$(document).unbind('keypress');
	$(document).keypress(function(event) {
		console.log(event.which);
		event.preventDefault();
		switch (event.which) {
			case 32:
				// Pause/Resume Game
				pauseGame();
				break;
			case 49:
				// Play Level 1
				startLevel(1);
				break;
			case 50:
				// Play Level 1
				startLevel(2);
				break;
			case 113:
				// quit level
				//gameOver=true;
				//clearLevel();
				break;
		}
	});
}