import {CST} from "../CST.js";      

var timeline;
var cam;


var tween;
var target = new Phaser.Math.Vector2();


export class TestScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.TEST
		})
	}
		
	init(data){
		console.log(data);
	}
	preload(){
		this.load.image('Wak', './Images/111.png');
	}
	create(){
		
		var g1 = this.add.grid(0, 0, 2400, 2400, 24, 24, 0x00b9f2).
	setAltFillStyle(0x016fce).setOutlineStyle();
		
	var image = this.add.image(100, 100, 'Wak');
		
	this.cameras.main.setBounds(0, 0, 10000, 10000);
	cam = this.cameras.main;
	cam.startFollow(image, true);
	
		
		 tween = this.tweens.add({
        targets: image,
        x: 400,
        y: 300,
        ease: 'Linear',
        duration: 1000,
        paused: true
    });
		
	//console.log(this.scene.input.activePointer);
		
	 this.input.on('pointerdown', function (pointer) {

	console.log(this.scene.input.activePointer);
		 
    this.scene.input.activePointer.updateWorldPoint(this.scene.cameras.main);
    const realPointer = this.scene.input.activePointer
		 
        target.x = realPointer.worldX
        target.y = realPointer.worldY

        tween.play();
    });
		
	}
	update(){
		 if (tween.isPlaying())
    	{
       		 tween.updateTo('x', target.x, true);
        	tween.updateTo('y', target.y, true);
    	}
}
}