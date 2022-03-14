import {CST} from "../CST.js";                  

var source;
var target = new Phaser.Math.Vector2();
var cam;
var cursors;
var loadGame;
var g1;
var timeline;
var noteArr = []
var keys;
//var keyObj = scene.input.keyboard.addKey('W', enableCapture, emitOnRepeat);
// 키, false로, 반복 가능 true
var debug
var image;

var timer;

var duration_ = 1
var indexOfNotes = 0;

var nowPlay = false;

var pressed = false;

var timedEvent;
class note {
	constructor (pos, duration, image, text, judgeText) { 
		this.pos = pos;
		this.duration = duration;
		this.image = image;
		this.text = text;
		this.judgeText = judgeText;
		this.judgeOnce = false;
	}
}

var notes = []


export class PlayScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.PLAY
		})
	}
	
	init(data){
		console.log(data)
		loadGame = this;
		debug = this.add.graphics();
	}
	preload(){
		loadImage();
	}
	create(){
		initTimer();
		
		drawGrid();
		this.add.image(0, 0, 'start').setDepth(0);
		source = this.physics.add.image(100, 100, 'Wak').setDepth(2);
		cursors = this.input.keyboard.createCursorKeys();
		
		keys = initKey();
		
		initCam();
		
		 
		
		
		this.input.on('pointerdown', function (pointer) {

			target = returnRealPos(this.scene.input.activePointer);

		 	if (pointer.leftButtonDown()){	
			 
				if (keys.Q.isDown){
					if(nowPlay === false)
						addNote(target);
				}
				else if(keys.R.isDown){
					if(nowPlay === false)
						startTimeline();
				}
				else if(keys.W.isDown){
					if(nowPlay === false)
						deleteNote(target);
				}
				else{
					if(nowPlay === false)
						movePlayer();
				}
			}
    	});
	}
	update(){
		camZoom();
		stopPlayer();
		if(nowPlay)
			this.events.emit("setTimes", timer.getElapsedSeconds().toFixed(3));
		checkIsRight();
	}		
}

function inputOnce(){
	if(pressed === false){
		if(keys.Space.isDown){
			pressed = true;
			return true;
		}
		if(keys.Space.isUp)
			pressed = false;
		
		return false;
	}else{
		if(keys.Space.isUp)
			pressed = false;
		
		return false;
	}
	
	
	
	
}

function checkIsRight(){
	
	if(nowPlay === true){
		var nowTime = timer.getElapsedSeconds().toFixed(3)
		var floorTime = Math.round(nowTime);
		
		
		var realIndex = indexOfNotes + floorTime;
		var cur = Math.abs(nowTime - realIndex);
		
		
		if(inputOnce()){
			var index = realIndex - 1;
			
			if(cur > 0.4 || notes[index].judgeOnce === true)
				return;
			
			if(cur < 0.1){
				notes[index].judgeOnce = true;
				notes[index].judgeText.setText("perfect");
			}else if(cur < 0.2){
				notes[index].judgeOnce = true;
				notes[index].judgeText.setText("good");
			}else if(cur < 0.3){
				notes[index].judgeOnce = true;
				notes[index].judgeText.setText("bad");
			}else if(cur < 0.4){
				notes[index].judgeOnce = true;
				notes[index].judgeText.setText("miss");
			}
			
		}
	}
}

function initTimer(){
		timer = loadGame.time.addEvent({
			startAt: 0,
    		timeScale: 1,
    		loop: true,
			paused: true
		});
}

function drawNoteLine(){
	debug.clear().lineStyle(4, 0x00ff00);
	if(noteArr.length >= 1)
		drawLine(0, 0, noteArr[0].x, noteArr[0].y);
	
	for(var i = 0; i < noteArr.length - 1; i++){
		drawLine(noteArr[i].x, noteArr[i].y, 
		noteArr[i + 1].x, noteArr[i + 1].y);
	}
}

function drawLine(pos1_x, pos1_y, pos2_x, pos2_y){
    debug.lineBetween(pos1_x, pos1_y, pos2_x, pos2_y).setDepth(3);
}

function startTimeline(){
	nowPlay = true;
	image = loadGame.add.image(0, 0, 'Wak').setDepth(1);
	camFollow(image);
	image.setPosition(0, 0);
	timeline = buildTimeline(image);
	timeline.play();
	g1.setVisible(false);
	source.setVisible(false);
	
	timer.paused = false;
}

function endTimeline(){
	
	console.log("end11")
	nowPlay = false;
	image.destroy();
	camFollow(source);
	g1.setVisible(true);
	source.setVisible(true);
	
	timer.paused = true;
	timer.remove();
	timer = loadGame.time.addEvent({
		startAt: 0,
    	timeScale: 1,
    	loop: true,
		paused: true,
	});
	
	for(var i = 0; i < notes.length; i++){
		notes[i].judgeText.setText("");
		notes[i].judgeOnce = false;
	}
}

function deleteNote(target){
	var xRound = Math.round(target.x / 240) * 240;
	var yRound = Math.round(target.y / 240) * 240;
	
	var index = -1;
	
	for(var i = 0; i < noteArr.length; i++){
		if(noteArr[i].x === xRound && noteArr[i].y === yRound){
			index = i;
			break;
		}
	}
	
	if(index === -1){
		return;
	}else{
		noteArr.splice(index, 1);
		
		notes[index].image.destroy();
		notes[index].text.destroy();
		notes[index].judgeText.destroy();
		notes.splice(index, 1);
		
		for(var i = 0; i < notes.length; i++){
			notes[i].text.setText(i);
		}
		//여기에 텍스트랑 이미지 없애는 코드 추가
		drawNoteLine();
	}
}

function addNote(target){
	var xRound = Math.round(target.x / 240) * 240;
	var yRound = Math.round(target.y / 240) * 240;
	
	var color1 = Phaser.Display.Color.GetColor(100, 20, 180);
	
	var Image = loadGame.add.image(xRound, yRound, 'dot').setDepth(0);
	var text = loadGame.add.text(xRound + 10, yRound - 50, notes.length)
	.setFont('20px Arial').setColor('#00FFFF').setAlign('center');
	//hex code 색상임
	
	var judgeText = loadGame.add.text(xRound + 10, yRound + 50, "")
	.setFont('20px Arial').setColor('#FF1E1E').setAlign('center');
	//hex code 색상임

					
	var newNote = new note({x: xRound, y: yRound}, 0, Image, text, judgeText)
	
	notes.push(newNote);
	noteArr.push({x: newNote.pos.x, y: newNote.pos.y})
	drawNoteLine();
}

function initKey(){
	var keys = loadGame.input.keyboard.addKeys('Q,W,E,R,Space', true, true);
	return keys;
}

function returnRealPos(pointer){
	pointer.updateWorldPoint(cam);
   	const realPointer = pointer; 
	var realPos = new Phaser.Math.Vector2();
	realPos.x = realPointer.worldX
    realPos.y = realPointer.worldY
	
	return realPos;
}

function buildTimeline(image){
	 var line = loadGame.tweens.timeline({
        targets: image,
        ease: 'Linear',
        duration: 1000,
        tweens: noteArr,
		paused: true,
		onComplete: () => {
			console.log("end")
			
			timedEvent = loadGame.time.addEvent
		 ({ delay: 1000, callback: endTimeline, callbackScope: this});
        }
    });
	
	return line;
}

function movePlayer(){
	loadGame.physics.moveToObject(source, target, 1000);
}

function initCam(){
	cam = loadGame.cameras.main;
	cam.zoom = 0.6;
	camFollow(source);
}

function camFollow(object){
	cam.startFollow(object, true);
}

function camZoom(){
	if (cursors.up.isDown){
		cam.zoom += 0.03
	}
	else if (cursors.down.isDown){
		cam.zoom -= 0.03
	}
}


function stopPlayer(){
	var distance = Phaser.Math.Distance.Between(source.x, source.y, target.x, target.y);
    if (source.body.speed > 0){
        if (distance < 10){
       	    source.body.reset(target.x, target.y);
        }
    }
}

function drawGrid(){
	var color = Phaser.Display.Color.GetColor(0, 0, 0);
	var color1 = Phaser.Display.Color.GetColor(0, 0, 0);
	var color2 = Phaser.Display.Color.GetColor(204, 204, 204);
		
	g1 = loadGame.add.grid(0, 0, 2400, 2400, 240, 240, color).
	setAltFillStyle(color1).setOutlineStyle(color2);
}

function loadImage(){
	loadGame.load.image('Wak', './Images/111.png');
	loadGame.load.image('dot', './Images/dot.png');
	loadGame.load.image('start', './Images/111111.png');
}