import {CST} from "../CST.js";                    
export class LoadScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.LOAD
		})
	}
	
	init(){
		
	}
	preload(){
		
		  let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff //white
            }
        })
		
		 this.load.on("progress", (percent) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            console.log(percent);
        })

        this.load.on("complete", () => {
            //this.scene.start(CST.SCENES.MENU, "hello from LoadScene");
        });
	}
	create(){
		console.log("adwawd")
		this.scene.start(CST.SCENES.MENU, "hello from LoadScene");
	}
}