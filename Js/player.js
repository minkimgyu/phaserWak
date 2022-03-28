export class Player {
	constructor (loadGame, depth = 2) {
		this.loadGame = loadGame;
		this.image = this.loadGame.physics.add.image(0, 0, 'Wak').setDepth(depth);
	}
	
	movePlayer(target){
		this.loadGame.physics.moveToObject(this.image, target, 1000);
	}
	
	stopPlayer(target){
		
		var distance = Phaser.Math.Distance.Between
		(this.image.x, this.image.y, target.x, target.y);
		if (this.image.body.speed > 0){
			if (distance < 10){
				this.image.body.reset(target.x, target.y);
			}
		}
	}
}
