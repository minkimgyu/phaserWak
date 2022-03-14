import {CST} from "../CST.js";    

var name;
var text;

var image;
var textBox

var loadGame;
var talkIndex = 0;

var line;
var load;

var nowLoad = false;

class crossLoad{
	constructor(take1, take2, take3){
		this.take1 = take1;
		this.take2 = take2;
		this.take3 = take3;
    };
	
	setOnOff(isOn){
		this.take1.setVisible(isOn);
		this.take2.setVisible(isOn);
		this.take3.setVisible(isOn);
	}
	
	
}

class talkScene{
	
	constructor(who, talk, image, isLeft, isMove = false, nowSelect = false){
		this.who = who;
		this.talk = talk;
		this.image = image;
		this.isLeft = isLeft;
		this.isMove = isMove;
		this.nowSelect = nowSelect;
    };
	
	initTalkScene(){
		if(this.isLeft){
			image = loadGame.add.image(100, 300, 'Wak');
			image.flipX = true;
		}else{
			image = loadGame.add.image(700, 300, 'Wak');
		}
		
		textBox = loadGame.add.image(400, 500, 'textBox');
		textBox.alpha = 0.5;
		
		name = loadGame.add.text(0 + 50, 300 + 130, "「" + this.who + "」")
	.setFont('20px Arial').setColor('#000028').setAlign('left');
		text = loadGame.add.text(0 + 50, 300 + 180, this.talk)
	.setFont('15px Arial').setColor('#000028').setAlign('left');
		
		if(this.isMove){
			playLine();
		}
		
		//if(this.nowSelect){
		//	load.setOnOff(true);
		//	nowLoad = true;
		//}
	}
	
	deleteTalkScene(){
		
		if(this.isMove){
			stopLine();
		}
		
		textBox.destroy();
		textBox = null;
		
		image.destroy();
		image = null;
		
		name.destroy();
		name = null;
		
		text.destroy();
		text = null;
	}
}

var talks = [];

export class TestScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.TEST
		})
	}
		
	init(data){
		loadGame = this;
	}
	preload(){
		this.load.image("back", "./Images/back.jpg");
		this.load.image('textBox', './Images/text8.png');
		this.load.image('textMiniBox', './Images/text9.png');
		this.load.image('Wak', './Images/wak2.png');
		initTalk();
	}
	create(){
		// var image1 = loadGame.add.image(400, 360, 'textMiniBox').setDepth(2).setScale(0.6);
		// image1.alpha = 0.8;
		
		// var image2 = loadGame.add.image(400, 230, 'textMiniBox').setDepth(2).setScale(0.6);
		// image2.alpha = 0.8;
		
		// var image3 = loadGame.add.image(400, 100, 'textMiniBox').setDepth(2).setScale(0.6);
		// image3.alpha = 0.8;
		
		//load = new crossLoad(image1, image2, image3);
		//load.setOnOff(false);
		
		if(nowLoad)
			setLoad()
		
		// load.take1.on("pointerup", ()=>{
		// 	console.log(1);
		// })
		
		// load.take2.on("pointerup", ()=>{
		// 	console.log(2);
		// })
		
		// load.take3.on("pointerup", ()=>{
		// 	console.log(3);
		// })
		
		this.add.image(0, 0, "back").setOrigin(0).setDepth(0).setScale(0.58);;
		this.cameras.main.backgroundColor.setTo(0, 200, 200);
		nextTalk();
		this.input.on('pointerdown', function (pointer) {
			nextTalk();
    	});
	}
	update(){
	}
}

function initTalk(){
	talks.push(new talkScene("우왁굳", "ㅜㅠㅠ", "Wak", false))
	talks.push(new talkScene("우왁굳1", "ㅜㅠㅠㅠ", "Wak", true, true))
	talks.push(new talkScene("우왁굳2", "ㅜㅠㅠㅠㅠ", "Wak", false))
	talks.push(new talkScene("우왁굳3", "ㅠ", "Wak", true, false, true))
	talks.push(new talkScene("우왁굳4", "ㅜㅠ", "Wak", false))
}

function nextTalk(){
	
	if(talks.length < talkIndex + 1){
		return;
	}
	
	if(talkIndex === 0){
		talks[talkIndex].initTalkScene();
	}else{
		talks[talkIndex].deleteTalkScene();
		talks[talkIndex].initTalkScene();
	}
	
	talkIndex += 1;
}

function playLine(){
	 line = loadGame.tweens.timeline({
        targets: image,
        ease: 'Linear',
        duration: 1000,
		tweens: [{x: 300, y: 300}, {x: 500, y: 300}, {x: 700, y: 300}],
		paused: false
    });
}

function stopLine(){
	
	if(line != null){
		line.stop();
		line = null;
	}
}