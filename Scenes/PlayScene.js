import {CST} from "../CST.js";                  
import {LineContainer} from '../Js/lineScript.js';
import {NoteContainer} from '../Js/noteScript.js';
import {Player} from '../Js/player.js';
import {Camera} from '../Js/camera.js';
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
var image;

var timer;

var indexOfNotes = 0;

var nowPlay = false;

var pressed = false;

var normalDur = 1;

var timedEvent;

var longNoteCount = 0;

var indexOfLongNote = [];


// 라인, 노트 컨테이너
var noteContainer;
var lineContainer;
var camera;
var player;

export class PlayScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.PLAY
		})
		
		this.mode = CST.MODE.IDLE;
	}
	
	setMode(mode){
		this.mode = mode;
	}
	
	checkMode(mode){
		if(this.mode === mode){
			return true;
		}else{
			return false;
		}
	}
	
	init(data){
		console.log(data)
		loadGame = this;
		UIScene = loadGame.scene.get("UI");
		
		
	}
	preload(){
		loadImage();
	}
	create(){
	
		lineContainer = new LineContainer(loadGame, UIScene);
		noteContainer = new NoteContainer(loadGame, lineContainer);
		camera = new Camera(loadGame);
		player = new Player(loadGame);
		
		camera.camFollow(player.image);
		
		lineContainer.initTimer();
		
		drawGrid();
		cursors = this.input.keyboard.createCursorKeys();
		keys = initKey();
		
		
		this.input.on('pointerdown', function (pointer) {

			target = returnRealPos(this.scene.input.activePointer);

		 	if (pointer.leftButtonDown()){	
				if(keys.A.isDown){
					if(loadGame.checkMode(CST.MODE.ADDDOT)){
						if(lineContainer.canReturnSelectLine()){
							lineContainer.selectedLine.addDot(target);
						}
					}
					else if(loadGame.checkMode(CST.MODE.DELETEDOT)){
						if(lineContainer.canReturnSelectLine()){
							lineContainer.selectedLine.deleteDot(target);
						}
					}
					else if(loadGame.checkMode(CST.MODE.ADDLINE)){
						lineContainer.addLine(target);
					}
					else if(loadGame.checkMode(CST.MODE.DELETELINE)){
						lineContainer.deleteLine();
					}
					else if(loadGame.checkMode(CST.MODE.ADDNOTE)){
						noteContainer.addNote(target);
					}
					else if(loadGame.checkMode(CST.MODE.ADDLONGNOTE)){
						noteContainer.addLongNote(target);
					}
					else if(loadGame.checkMode(CST.MODE.DELETENOTE)){
						noteContainer.deleteNote(target);
					}
				}else{
					player.movePlayer(target);
				}
			}
    	});
		
		this.input.on('gameobjectdown',this.onObjectClicked);
	}
	 onObjectClicked(pointer,gameObject){
		 
		 if (pointer.leftButtonDown()){	
			if(keys.A.isDown){
		 
				 if(gameObject === null){
					 return;
				 }

				 if(loadGame.checkMode(CST.MODE.SELECTLINE)){
					lineContainer.selectLine(lineContainer.lines[gameObject.name.INDEXOFLINE]);
					UIScene.SetselectedLineText(gameObject.name.INDEXOFLINE);
				 }
				 else if(loadGame.checkMode(CST.MODE.DELETESELECTLINE)){
					lineContainer.clearSelectedLine();
					UIScene.SetClearLineText();
				 }
				 else if(loadGame.checkMode(CST.MODE.SEEDATA)){
					 
					var type = gameObject.name.TYPE;
					 
					if(type === CST.TYPE.DOT){
						var indexOfLine = gameObject.name.INDEXOFLINE;
						var indexOfDot = gameObject.name.INDEXOFDOT;
						UIScene.SetPanel
						(lineContainer.lines[indexOfLine].dots[indexOfDot], type);
					}else{
						var index = gameObject.name.INDEX;
						UIScene.SetPanel(noteContainer.notes[index], type);
					}
				 }
			}
		}
		 
		 // if(keys.A.isDown){
		 // var type = gameObject.name.TYPE;
		 // var index = gameObject.name.INDEX;
			 
		 // if(type === CST.TYPE.DOT){
		 // UIScene.SetPanel(lines[index], type, index);
		 // }else{
		 // UIScene.SetPanel(notes[index], type, index);
		 // }
		 // }
    }
	update(){
		camera.camZoom(cursors);
		player.stopPlayer(target);
		if(nowPlay){
			UIScene.SetTimes(timer.getElapsedSeconds().toFixed(3));
			JudgeNote();
		}
	}
	changeValue(type, index, value){
		
		if(type === CST.TYPE.DOT){
			
			if(lineContainer.canReturnSelectLine() === false)
				return;
			
			var line = lineContainer.returnSelectLine()
			
			for(var i = 0; i < noteContainer.notes.length; i++){
				if(noteContainer.notes[i].indexOfDot === index){
					return;
				}
			}
			
			line.dots[index].ResetDot(value.pos, value.duration);
			line.drawLine();
			line.ReTextOfDot();

			// 노트 혹은 닷 이동, 닷 시간 바꾸기, 이를 노트에 입력하기
		}
	}	
}

function JudgeNote(){
	
	var nowTime = timer.getElapsedSeconds().toFixed(3)
	var addTime = 0.5;
		
	if(notes.length - 1 >= indexOfNotes){
		if(notes[indexOfNotes].duration + addTime <= nowTime){
			indexOfNotes += 1;
		}
		
		notes[indexOfNotes].judge(nowTime);
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
	var keys = loadGame.input.keyboard.addKeys('Q,W,E,R,T,A,B,T,Space', true, true);
	return keys;
}

function returnRealPos(pointer){
	pointer.updateWorldPoint(camera.cam);
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