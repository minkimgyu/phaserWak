import {CST} from "../CST.js";            
export class MenuScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.MENU
		})
	}
	
		
	init(data){
		console.log(data);
		console.log("Got It");
	}
	preload(){
		this.load.image("title_bg", "./Images/title_bg.jpg");
		this.load.image("play_button", "./Images/play_button.png");
		this.load.image("options_button", "./Images/options_button.png");
		this.load.image("logo", "./Images/logo.png");
	}
	create(){
			this.add.text(20, 20, CST.SCENES.MENU + "   Playing game...", {font: "25px Arial", fill: "yellow"});
		this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.2, "logo").setDepth(1);
		this.add.image(0, 0, "title_bg").setOrigin(0).setDepth(0);
		
		let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "play_button").setDepth(1);
		
		let optionButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, "options_button").setDepth(1);
		
		playButton.setInteractive();
		
		// playButton.on("pointerover", ()=>{
		// 	console.log("pointerover");
		// })
		
		// playButton.on("pointerout", ()=>{
		// 	console.log("pointerout");
		// })
		
		playButton.on("pointerup", ()=>{
			this.scene.start(CST.SCENES.PLAY, "now Play");
		})
	}
}