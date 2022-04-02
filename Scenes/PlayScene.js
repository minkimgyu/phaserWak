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

var g1;
var timeline;
//var lineArr = []
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

var player;

export class PlayScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.PLAY
		})
		
		this.mode = CST.MODE.IDLE;
		this.keys = null;
		this.camera = null;
		this.UIScene = null;
		
		this.noteContainer = null;
		this.lineContainer = null;
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
	
	startGame(){
		this.lineContainer.startLine();
		this.noteContainer.sortNotes();
		nowPlay = true;
		g1.setVisible(false);
		player.setVisible(false);
	}
	
	endGame(){
		this.lineContainer.endline();
		this.noteContainer.clearJudge();
		nowPlay = false;
		this.UIScene.ResetTimes();
		this.camera.camFollow(player.image);
		g1.setVisible(true);
		player.setVisible(true);
	}
	
	init(data){
		console.log(data)
		loadGame = this;
		this.UIScene = loadGame.scene.get("UI");
		
		
	}
	preload(){
		loadImage();
	}
	create(){
	
		this.lineContainer = new LineContainer(loadGame);
		this.noteContainer = new NoteContainer(loadGame);
		this.camera = new Camera(loadGame);
		player = new Player(loadGame);
		
		this.camera.camFollow(player.image);
		
		this.lineContainer.initTimer();
		
		drawGrid();
		cursors = this.input.keyboard.createCursorKeys();
		this.keys = this.initKey();
		
		console.log(this.keys)
		
		this.input.on('pointerdown', function (pointer) {

			target = returnRealPos(this.scene.input.activePointer);

		 	if (pointer.leftButtonDown()){
				if(loadGame.keys.A.isDown){
					if(loadGame.checkMode(CST.MODE.ADDDOT)){
						if(loadGame.lineContainer.canReturnSelectLine()){
							loadGame.lineContainer.selectedLine.addDot(target);
						}
					}
					else if(loadGame.checkMode(CST.MODE.DELETEDOT)){
						if(loadGame.lineContainer.canReturnSelectLine()){
							loadGame.lineContainer.selectedLine.deleteDot(target);
						}
					}
					else if(loadGame.checkMode(CST.MODE.ADDLINE)){
						loadGame.lineContainer.addLine(target);
					}
					else if(loadGame.checkMode(CST.MODE.DELETELINE)){
						loadGame.lineContainer.deleteLine();
					}
					else if(loadGame.checkMode(CST.MODE.ADDNOTE)){
						loadGame.noteContainer.addNote(target);
					}
					else if(loadGame.checkMode(CST.MODE.ADDLONGNOTE)){
						loadGame.noteContainer.addLongNote(target);
					}
					else if(loadGame.checkMode(CST.MODE.DELETENOTE)){
						loadGame.noteContainer.deleteNote(target);
					}
				}else{
					player.movePlayer(target);
				}
			}
    	});
		
		this.input.on('gameobjectdown',this.onObjectClicked);
		//this.input.keyboard.on('keydown',this.keydown);
		//this.input.keyboard.on('keyup',this.keyup);
	}
	
	// keydown(event){
	// 	if(nowPlay){
	// 		loadGame.noteContainer.judgeNote();
	// 	}
	// }
	
	// keyup(event){
	// 	if(nowPlay){
	// 		loadGame.noteContainer.judgeNote();
	// 	}
	// }
	
	onObjectClicked(pointer,gameObject){
		 
		 if (pointer.leftButtonDown()){	
			if(loadGame.keys.A.isDown){
		 
				 if(gameObject === null){
					 return;
				 }

				 if(loadGame.checkMode(CST.MODE.SELECTLINE)){
					loadGame.lineContainer.selectLine(loadGame.lineContainer.lines[gameObject.name.INDEXOFLINE]);
					loadGame.UIScene.SetselectedLineText(gameObject.name.INDEXOFLINE);
				 }
				 else if(loadGame.checkMode(CST.MODE.DELETESELECTLINE)){
					loadGame.lineContainer.clearSelectedLine();
					loadGame.UIScene.SetClearLineText();
				 }
				 else if(loadGame.checkMode(CST.MODE.SEEDATA)){
					 
					var type = gameObject.name.TYPE;
					 
					if(type === CST.TYPE.DOT){
						var indexOfLine = gameObject.name.INDEXOFLINE;
						var indexOfDot = gameObject.name.INDEXOFDOT;
						loadGame.UIScene.SetPanel
						(loadGame.lineContainer.lines[indexOfLine].dots[indexOfDot], type);
					}else{
						var index = gameObject.name.INDEX;
						loadGame.UIScene.SetPanel(loadGame.noteContainer.notes[index], type);
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
		this.camera.camZoom(cursors);
		player.stopPlayer(target);
		if(nowPlay){
			this.UIScene.SetTimes(this.lineContainer.timer.getElapsedSeconds().toFixed(3));
			this.noteContainer.judgeNote();
		}
	}
	changeValue(type, index, value){
		
		if(type === CST.TYPE.DOT){
			
			if(this.lineContainer.canReturnSelectLine() === false)
				return;
			
			var line = this.lineContainer.returnSelectLine()
			
			for(var i = 0; i < this.noteContainer.notes.length; i++){
				if(this.noteContainer.notes[i].indexOfDot === index){
					return;
				}
			}
			
			line.dots[index].ResetDot(value.pos, value.duration);
			line.drawLine();
			line.ReTextOfDot();

			// 노트 혹은 닷 이동, 닷 시간 바꾸기, 이를 노트에 입력하기
		}
	}
	
	initKey(){
		var keys = loadGame.input.keyboard.addKeys('Q,W,E,R,T,A,B,T,Space', true, true);
		return keys;
	}
}

function returnRealPos(pointer){
	pointer.updateWorldPoint(loadGame.camera.cam);
   	const realPointer = pointer; 
	var realPos = new Phaser.Math.Vector2();
	realPos.x = realPointer.worldX
    realPos.y = realPointer.worldY
	
	return realPos;
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