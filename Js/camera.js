export class Camera {
	constructor (loadGame) { 
		this.loadGame = loadGame;
		this.cam = this.loadGame.cameras.main;
		this.cam.zoom = 0.6;
	}
	
	camFollow(object){
		this.cam.startFollow(object, true);
	}

	camZoom(cursor){
		if (cursor.up.isDown){
			var temp = this.cam.zoom + 0.03;
			this.camZoomByValue(temp);
		}
		else if (cursor.down.isDown){
			var temp = this.cam.zoom - 0.03;
			this.camZoomByValue(temp);
		}
	}
	
	camZoomByValue(depth){
		this.cam.zoom = depth;
	}
}
