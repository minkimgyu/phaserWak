import {CST} from "../CST.js"; 

export class UIScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.UI
		})
	}
	
		
	init(data){
	}
	preload(){
		
	}
	create(){
		
		var text = this.add.text(20, 20, "UI Scene", 
					  {font: "25px Arial", fill: "yellow"});
		
		var PlayScene = this.scene.get("PLAY")
		
		PlayScene.events.on("setTimes", function(value){
			text.setText("Times: " + value);
		}, this);
		
		
	}
}