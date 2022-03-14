import {CST} from "../CST.js";    

var name;
var text;

export class TestScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.TEST
		})
	}
		
	init(data){
	}
	preload(){
		this.load.image('textBox', './Images/text8.png');
		this.load.image('Wak', './Images/wak1.png');
	}
	create(){
		this.cameras.main.backgroundColor.setTo(0, 200, 200);
		this.add.image(400, 500, 'textBox');
		this.add.image(700, 300, 'Wak');
		
		//this.add.image(100, 300, 'Wak').flipX = true;
		
		
		name = this.add.text(0 + 50, 300 + 130, "「우왁굳」")
	.setFont('20px Arial').setColor('#000028').setAlign('left');
		
		text = this.add.text(0 + 50, 300 + 180, "형ㅜㅠㅠㅠㅠ")
	.setFont('15px Arial').setColor('#000028').setAlign('left');
	}
	update(){
	}
}