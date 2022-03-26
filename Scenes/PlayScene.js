import {CST} from "../CST.js";                  
import {ab} from '../Js/lineScript.js';

//'./Images/startDot.png'

var source;
var target = new Phaser.Math.Vector2();
var cam;
var cursors;
var loadGame;
var UIScene;

var g1;
var timeline;
//var lineArr = []
var keys;
var debug
var image;

var timer;

var indexOfNotes = 0;

var nowPlay = false;

var pressed = false;

var normalDur = 1;

var timedEvent;

var longNoteCount = 0;

var indexOfLongNote = [];

class line {
	constructor (pos, duration, image, text, timeText) { 
		this.pos = pos;
		this.duration = duration;
		this.image = image;
		this.text = text;
		this.timeText = timeText;
		this.haveNote = false;
	}
	
	ResetDot(pos, duration){
			this.pos.x = pos.x
			this.pos.y = pos.y
			this.duration = duration;
			
			this.image.setPosition(this.pos.x, this.pos.y)
			this.text.setPosition(this.pos.x + 10, this.pos.y - 50)
			this.timeText.setPosition(this.pos.x + 10, this.pos.y + 30)
	}
}
var lines = []

class note {
	constructor (pos, duration, image, judgeText, indexOfDot, type) { 
		this.pos = pos;
		this.duration = duration;
		this.image = image;
		this.judgeText = judgeText;
		this.judgeOnce = false;
		this.indexOfDot = indexOfDot;
		this.addTime = 0.5;
		this.type = type;
		this.head = true;
	}
	
	judge(nowTime){
		checkType(nowTime);
	}
	
	checkType(nowTime){
		if(this.type === CST.TYPE.NOTE){
			if(inputOnce(keys.Space)){
				if(this.judgeOnce)
					return;

				var minTime = this.duration - this.addTime;
				var maxTime = this.duration + this.addTime;

				if(nowTime >= minTime && nowTime <= maxTime){
					var cur = Math.abs(nowTime - this.duration);

					var rank = null;

					if(cur < 0.1){
						rank = "perfect";
					}else if(cur < 0.2){
						rank = "good";
					}else if(cur < 0.3){
						rank = "bad";
					}else if(cur < 0.4){
						rank = "miss";
					}

					this.judgeText.setText(rank);
					this.judgeOnce = true;
				}else{
					return;
				}
			}
		}else if(this.type === CST.TYPE.LONGNOTE){
			
		}else if(this.type === CST.TYPE.LONGNOTEMINI){
			
			if(this.judgeOnce)
					return;
				
			var rank = "";
				
			if(nowTime >= this.duration && keys.Space.isDown){
				rank = "perfect";
				this.judgeText.setText(rank);
				this.judgeOnce = true;
			}else if(nowTime >= this.duration && !keys.Space.isDown){
				rank = "miss";
				this.judgeText.setText(rank);
				this.judgeOnce = true;
			}
		}
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
		UIScene = loadGame.scene.get("UI");
		
		ab();
	}
	preload(){
		loadImage();
	}
	create(){
		initTimer();
		
		drawGrid();
		this.add.image(0, 0, 'start').setDepth(0);
		source = this.physics.add.image(0, 0, 'Wak').setDepth(2);
		cursors = this.input.keyboard.createCursorKeys();
		
		keys = initKey();
		
		initCam();
		
		 
		
		
		this.input.on('pointerdown', function (pointer) {

			target = returnRealPos(this.scene.input.activePointer);

		 	if (pointer.leftButtonDown()){	
			 
				if (keys.Q.isDown){
					if(nowPlay === false)
						addLine(target);
				}
				else if(keys.W.isDown){
					if(nowPlay === false)
						deleteLine(target);
				}
				else if(keys.E.isDown){
					if(nowPlay === false)
						addNote(target);
				}
				else if(keys.R.isDown){
					if(nowPlay === false)
						deleteNote(target);
				}
				else if(keys.T.isDown){
					if(nowPlay === false)
						startTimeline();
				}
				else if(keys.B.isDown){
					if(nowPlay === false)
						addLongNote(target);
				}
				else{
					if(nowPlay === false && !keys.A.isDown)
						movePlayer();
				}
			}
    	});
		
		this.input.on('gameobjectdown',this.onObjectClicked);
	}
	 onObjectClicked(pointer,gameObject){
		 
		 if(keys.A.isDown){
			 var type = gameObject.name.TYPE;
			 var index = gameObject.name.INDEX;
			 
			if(type === CST.TYPE.DOT){
				UIScene.SetPanel(lines[index], type, index);
			}else{
				UIScene.SetPanel(notes[index], type, index);
			}
		 }
    }
	update(){
		camZoom();
		stopPlayer();
		if(nowPlay){
			UIScene.SetTimes(timer.getElapsedSeconds().toFixed(3));
			checkIsRight();
		}
	}
	changeValue(type, index, value){
		
		if(type === CST.TYPE.DOT){
			
			for(var i = 0; i < notes.length; i++){
				if(notes[i].indexOfDot === index){
					console.log("haveNote")
					return;
				}
			}
			
			var line = lines[index];
			line.ResetDot(value.pos, value.duration)
			
			debug.clear().lineStyle(4, 0x00ff00);
			if(lines.length >= 1)
				drawLine(0, 0, lines[0].pos.x, lines[0].pos.y);
			
			for(var t = 0; t < lines.length - 1; t++){
				drawLine(lines[t].pos.x, lines[t].pos.y, 
				lines[t + 1].pos.x, lines[t + 1].pos.y);
			}
			
			for(var i = 0; i < lines.length; i++){
				var noteDur = 0;
				for(var j = 0; j <= i; j++){
					noteDur += lines[j].duration;
				}	
				lines[i].timeText.setText(noteDur);
			}

			// 노트 혹은 닷 이동, 닷 시간 바꾸기, 이를 노트에 입력하기
		}
	}	
}
function a(string){
	console.log(string)
}

function ReturnLongNotePos(startIndex, EndIndex){
	
	var arrOfPos = [];
	
	for(var i = startIndex; i < EndIndex; i++){

		a("awd")
		
		var checkXEqual = lines[i].pos.x === lines[i + 1].pos.x;
		var checkYEqual = lines[i].pos.y === lines[i + 1].pos.y;
							
		var timesX = (lines[i + 1].pos.x - lines[i].pos.x) / 240;
		var timesY = (lines[i + 1].pos.y - lines[i].pos.y) / 240;
							
		var checkXTimes = Math.abs(timesX) > 1;
		var checkYTimes = Math.abs(timesY) > 1;
		
		if(i !== startIndex)
			arrOfPos.push({x: lines[i].pos.x, y: lines[i].pos.y})
		
							//y만 배수
		if(checkXEqual && checkYTimes){
			for(var j = 1; j < Math.abs(timesY); j++){
				if(timesY < 0){
					arrOfPos.push({x: lines[i].pos.x, y: -240 * j + lines[i].pos.y});
				}else{
					arrOfPos.push({x: lines[i].pos.x, y:240 * j + lines[i].pos.y});
				}
			}
							//x만 배수
		}else if(checkYEqual && checkXTimes){
			for(var j = 1; j < Math.abs(timesX); j++){
				if(timesX < 0){
					arrOfPos.push({x: -240 * j + lines[i].pos.x, y: lines[i].pos.y});
				}else{
					arrOfPos.push({x: 240 * j + lines[i].pos.x, y: lines[i].pos.y});
				}
			}
							//x, y 둘 다 같은 배수
		}else if(checkXTimes && checkYTimes && Math.abs(timesX) === Math.abs(timesY)){
			for(var j = 1; j < Math.abs(timesX); j++){
									
				var k = 1;
				var z = 1;
									
				if(timesX < 0){
					k = k * -1;
				}
				if(timesY < 0){
					z = z * -1;
				}
									
				arrOfPos.push({x: 240 * j * k + lines[i].pos.x, y: 240 * j * z + lines[i].pos.y});
			}
		}
	}
	
	//arrOfPos.push({x: lines[EndIndex].pos.x, y: lines[EndIndex].pos.y})
	
	return arrOfPos;
}

function inputOnce(keyCode){
	if(pressed === false){
		if(keyCode.isDown){
			pressed = true;
			return true;
		}
		if(keyCode.isUp)
			pressed = false;
		
		return false;
	}else{
		if(keyCode.isUp)
			pressed = false;
		
		return false;
	}
}

function checkIsRight(){
	
	var nowTime = timer.getElapsedSeconds().toFixed(3)
	var addTime = 0.5;
		
	if(notes.length - 1 >= indexOfNotes){
		if(notes[indexOfNotes].duration + addTime <= nowTime){
			indexOfNotes += 1;
		}
		
		notes[indexOfNotes].judge(nowTime);
	
	}
}

function SetTypeOfImage(string, index){
	var data = { TYPE: string, INDEX: index }
	return data;
}

function addNote(target){
	var xRound = Math.round(target.x / 240) * 240;
	var yRound = Math.round(target.y / 240) * 240;
	
	var index = -1;
	
	for(var i = 0; i < lines.length; i++){
		if(lines[i].pos.x === xRound && lines[i].pos.y === yRound){
			index = i;
			break;
		}
	}
		
	
	if(index === -1){
		return;
	}else{
		
		var noteDur = 0;
		if(lines.length != 0){
			for(var i = 0; i <= index; i++){
				noteDur += lines[i].duration;
			}
		}
		
		
		
		var image = loadGame.add.image(xRound, yRound, 'note').setDepth(0);
		image.name = SetTypeOfImage(CST.TYPE.NOTE, notes.length);
		
		
		
		var judgeText = loadGame.add.text(xRound + 70, yRound + 50, "")
		.setFont('20px Arial').setColor('#00FFFF').setAlign('center');
		//hex code 색상임
		var newNote = new note({x: xRound, y: yRound}, 
		noteDur, image, judgeText, index, CST.TYPE.NOTE)
		notes.push(newNote);
		//newNote.image.setInteractive();
	}
}

function addLongNote(target){
	var xRound = Math.round(target.x / 240) * 240;
	var yRound = Math.round(target.y / 240) * 240;
	
	var index = -1;
	
	for(var i = 0; i < lines.length; i++){
		if(lines[i].pos.x === xRound && lines[i].pos.y === yRound){
			index = i;
			break;
		}
	}
		
	
	if(index === -1){  
		return;
	}else{
		var noteDur = 0;
		if(lines.length != 0){
			for(var i = 0; i <= index; i++){
				noteDur += lines[i].duration;
			}
		}
		
		var image = loadGame.add.image(xRound, yRound, 'note1').setDepth(0);
		image.name = SetTypeOfImage(CST.TYPE.LONGNOTE, notes.length);
		
		var judgeText = loadGame.add.text(xRound + 70, yRound + 50, "")
		.setFont('20px Arial').setColor('#00FFFF').setAlign('center');
		var newNote = new note({x: xRound, y: yRound}, 
		noteDur, image, judgeText, index, CST.TYPE.LONGNOTE)
		notes.push(newNote);
		newNote.image.setInteractive();
		
		longNoteCount += 1;
		indexOfLongNote.push(index);
		
		if(longNoteCount === 2){
			
			var pos = ReturnLongNotePos(indexOfLongNote[0], indexOfLongNote[1]);
		
			for(var j = 0; j < pos.length; j++){
			
				var noteDur = 0;
				if(lines.length != 0){
					for(var i = 0; i <= index; i++){
						noteDur += lines[i].duration;
					}
				}
		
				var image = loadGame.add.image(pos[j].x, pos[j].y, 'note2').setDepth(0);
				image.name = SetTypeOfImage(CST.TYPE.LONGNOTEMINI, notes.length);
		
				var judgeText = loadGame.add.text(pos[j].x + 70, pos[j].y + 50, "")
				.setFont('20px Arial').setColor('#00FFFF').setAlign('center');
				var newNote = new note({x: pos[j].x, y: pos[j].y}, 
				noteDur, image, judgeText, index, CST.TYPE.LONGNOTEMINI)
				notes.push(newNote);
				newNote.image.setInteractive();
			}
		}
	}
}

function deleteNote(target){
	var xRound = Math.round(target.x / 240) * 240;
	var yRound = Math.round(target.y / 240) * 240;
	
	var index = -1;
	
	if(notes.length <= 0)
		return;
	
	for(var i = 0; i < notes.length; i++){
		if(notes[i].pos.x === xRound && notes[i].pos.y === yRound){
			index = i;
			break;
		}
	}
	
	if(index === -1){
		return;
	}else{
		var note = notes[index];
		
		notes[index].image.destroy();
		notes[index].judgeText.destroy();
		notes.splice(index, 1);
		
		note = null;;
		
		// 이미지 순서 초기화
		for(var i = 0; i < notes.length; i++){
			notes[i].image.name = SetTypeOfImage(CST.TYPE.NOTE, i);
		}
	}
}

function addLine(target){
	var xRound = Math.round(target.x / 240) * 240;
	var yRound = Math.round(target.y / 240) * 240;
	
	var color1 = Phaser.Display.Color.GetColor(100, 20, 180);
	
	var Image = loadGame.add.image(xRound, yRound, 'dot').setDepth(0);
	
	var text = loadGame.add.text(xRound + 10, yRound - 50, lines.length)
	.setFont('20px Arial').setColor('#00FFFF').setAlign('center');
	//hex code 색상임
	
	var noteDur = normalDur;
	
	if(lines.length != 0){
		for(var i = 0; i < lines.length; i++){
			noteDur += lines[i].duration;
		}
	}
	      
	var timeText = loadGame.add.text(xRound + 10, yRound + 30, noteDur)
	.setFont('20px Arial').setColor('#FF1E1E').setAlign('center');
	//hex code 색상임
	
	// var judgeText = loadGame.add.text(xRound + 10, yRound + 50, "")
	// .setFont('20px Arial').setColor('#FF1E1E').setAlign('center');
	//hex code 색상임

	Image.name = SetTypeOfImage(CST.TYPE.DOT, lines.length);
	var newNote = new line({x: xRound, y: yRound}, normalDur, Image, text, timeText)
	
	lines.push(newNote);
	newNote.image.setInteractive();
	//lineArr.push({x: newNote.pos.x, y: newNote.pos.y, duration: normalDur * 1000})
	drawNoteLine();
}

function deleteLine(target){
	var xRound = Math.round(target.x / 240) * 240;
	var yRound = Math.round(target.y / 240) * 240;
	
	var index = -1;
	
	if(lines.length <= 0)
		return;
	
	for(var i = 0; i < lines.length; i++){
		if(lines[i].pos.x === xRound && lines[i].pos.y === yRound){
			index = i;
			break;
		}
	}
	
	if(index === -1){
		return;
	}else{
		
		deleteNote(target)
		
		lines[index].image.destroy();
		lines[index].text.destroy();
		lines[index].timeText.destroy();
		lines.splice(index, 1);
		
		for(var i = 0; i < lines.length; i++){
			lines[i].text.setText(i);
			lines[i].image.name = SetTypeOfImage(CST.TYPE.DOT, i);
		}
		
		for(var i = 0; i < lines.length; i++){
			
			var noteDur = normalDur;
			for(var j = 0; j < i; j++){
				noteDur += lines[j].duration;
			}	
			lines[i].timeText.setText(noteDur);
		}
		
		drawNoteLine();
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
	if(lines.length >= 1)
		drawLine(0, 0, lines[0].pos.x, lines[0].pos.y);
	
	for(var i = 0; i < lines.length - 1; i++){
		drawLine(lines[i].pos.x, lines[i].pos.y, 
		lines[i + 1].pos.x, lines[i + 1].pos.y);
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
	
	indexOfNotes = 0;
}



function initKey(){
	var keys = loadGame.input.keyboard.addKeys('Q,W,E,R,T,A,B,Space', true, true);
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
	
	var lineArr = [];
	for(var i = 0; i < lines.length; i++){
		lineArr.push
		({duration: lines[i].duration * 1000, 
		  x: lines[i].pos.x, y: lines[i].pos.y});
	}
	
	 var line = loadGame.tweens.timeline({
        targets: image,
        ease: 'Linear',
        //duration: 1000,
        tweens: lineArr,
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
	loadGame.load.image('dot', './Images/lineDot.png');
	loadGame.load.image('note', './Images/dot.png');
	loadGame.load.image('note1', './Images/dot1.png');
	loadGame.load.image('note2', './Images/dot2.png');
	loadGame.load.image('start', './Images/startDot.png');
}