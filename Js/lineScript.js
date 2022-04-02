import {CST} from "../CST.js";                  

var normalDur = 1;

export class Dot {
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

export class LineContainer{
	constructor (loadGame) { 
		this.loadGame = loadGame;
		this.lines = [];
		this.selectedLine = null;
		this.timer = null;
	}
	
	addLine(target){
		
		var line = new Line(this.loadGame, this);
		this.lines.push(line);
		this.selectLine(line);
		line.index = this.lines.length - 1
		line.addDot(target); // 기본 점 1개
		
		this.loadGame.UIScene.SetselectedLineText(line.dots[0].image.name.INDEXOFLINE);
	}
	
	deleteLine(){
		
		if(this.selectedLine === null)
			return;
		
		var line = this.selectedLine;
		
		for(var i = 0; i < line.dots.length; i++){
			line.DeleteDotObject(i);
		}
		
		for(var i = 0; i < line.dots.length; i++){
			line.RemoveAtDots(i);
		}
		
		line.clearDebug();
		this.lines.splice(line.index, 1);
		
		for(var i = 0; i < line.length; i++){
			this.lines[i].setIndex(i);
		}
		
		this.clearSelectedLine();
		this.loadGame.UIScene.SetClearLineText();
		console.log(this.lines)
	}
	
	canReturnSelectLine(){
		if(this.selectedLine === null){
			return false;
		}else{
			return true;
		}
	}
	
	returnSelectLine(){
		return this.selectedLine;
	}
	
	clearSelectedLine(){
		this.selectedLine = null;
	}
	
	selectLine(line){
		this.selectedLine = null;
		this.selectedLine = line;
	}
	
	initTimer(){
		this.timer = this.loadGame.time.addEvent({
			startAt: 0,
    		timeScale: 1,
    		loop: true,
		});
	}
	
	startLine(){
		this.initTimer();
		
		for(var i = 0; i < this.lines.length; i++){
			this.lines[i].startTimeline();
		}
	}
	
	endline(){
		this.timer.paused = true;
		this.timer.remove();
		
		for(var i = 0; i < this.lines.length; i++){
			this.lines[i].endTimeline();
		}
	}
}

export class Line{
	constructor (loadGame) { 
		this.loadGame = loadGame;
		this.dots = [];
		this.index = -1;
		this.timeline = null;
		this.nowFinish = false;
		this.player = null;
		this.debug = this.loadGame.add.graphics();
		this.indexOfLongNote = [];
	}
	
	clearLongNote(){
		this.indexOfLongNote = [];
	}
	
	returnLongNote(){
		return this.indexOfLongNote;
	}
	
	returnLongNoteData(){
		return this.indexOfLongNote.length;
	}
	
	addLongNote(longNote){
		if(this.indexOfLongNote.length === 2){
			this.indexOfLongNote = [];
			this.indexOfLongNote.push(longNote)
			return false;
		}else if(this.indexOfLongNote.length === 1){
			
			console.log("clear")
			this.indexOfLongNote.push(longNote)
			return true;
		}else if(this.indexOfLongNote.length === 0){
			this.indexOfLongNote.push(longNote)
			return false;
		}else{
			return false;
		}
	}
	
	clearDebug(){
		this.debug.clear();
	}
	
	setIndex(index){
		this.index = index;
	}
	
	returnFirstDot(){
		return this.dots[0].duration; // 시작 시간을 알려줌
	}
	
	startTimeline(){
		
		this.player = this.loadGame.add.image(0, 0, 'Wak').setDepth(1);
		this.player.setPosition(this.dots[0].pos.x, this.dots[0].pos.y);
		this.player.setVisible(false);
		
		this.timeline = this.buildTimeline();
	}

 	endTimeline(){
		this.timeline.stop();
		this.timeline.destroy();
		this.timeline = null;
		this.player.destroy();
		this.player = null;
	}
	
	buildTimeline(){
	
		var dotArr = [];
		for(var i = 0; i < this.dots.length; i++){
			
			if(i === 0){
				dotArr.push({delay : this.dots[0].duration * 1000, 
								 duration: 0, x: this.dots[i].pos.x, y: this.dots[i].pos.y});
			}else{
				dotArr.push
			({duration: this.dots[i].duration * 1000,
			  x: this.dots[i].pos.x, y: this.dots[i].pos.y});
			}
		}
		
		 var timeline = this.loadGame.tweens.timeline({
			targets: this.player,
			ease: 'Linear',
			tweens: dotArr,
			paused: false,
			onStart: () => {
				if(this.index === 0){
					this.player.setVisible(true);
					this.loadGame.camera.camFollow(this.player);
				}else{
					this.loadGame.time.addEvent
				({ delay: this.dots[0].duration * 1000, callback: () => {
					  this.player.setVisible(true);
					  this.loadGame.camera.camFollow(this.player);
				  }
				 })
				}
			},
			onComplete: () => {
				this.nowFinish = true;
				if(this.loadGame.lineContainer.lines.length - 1 === this.index){
					this.loadGame.endGame();
				}else{
					this.endTimeline();
				}
			}
		});
		
		return timeline;
	}

	addDot(target){
		var xRound = returnRoundTarget(target.x);
		var yRound = returnRoundTarget(target.y);

		var Image = this.loadGame.add.image(xRound, yRound, 'dot').setDepth(0);

		var text = this.loadGame.add.text(xRound + 10, yRound - 50, this.dots.length)
		.setFont('20px Arial').setColor('#00FFFF').setAlign('center');

		var noteDur = 0;

		var timeText = this.loadGame.add.text(xRound + 10, yRound + 30, noteDur)
		.setFont('20px Arial').setColor('#FF1E1E').setAlign('center');

		Image.name = SetTypeOfImage(CST.TYPE.DOT, this.index, this.dots.length);
		//console.log(Image.name)
		
		var newNote;
		if(this.dots.length === 0){
			var newNote = new Dot({x: xRound, y: yRound}, 0, Image, text, timeText)
		}else{
			var newNote = new Dot({x: xRound, y: yRound}, normalDur, Image, text, timeText)
		}

		this.dots.push(newNote);
		newNote.image.setInteractive();
		
		
		
		if(this.dots.length != 0){
			for(var i = 0; i < this.dots.length; i++){
				noteDur += this.dots[i].duration;
			}
		}
		newNote.timeText.setText(noteDur);
		
		this.drawLine();
	}
	
	deleteDot(target){
		var xRound = returnRoundTarget(target.x);
		var yRound = returnRoundTarget(target.y);

		var index = -1;

		if(this.dots.length <= 0)
			return;

		for(var i = 0; i < this.dots.length; i++){
			if(this.dots[i].pos.x === xRound && this.dots[i].pos.y === yRound){
				index = i;
				break;
			}
		}

		if(index === -1){
			return;
		}else{

			this.DeleteDotObject(index);
			this.RemoveAtDots(index)
			this.ResetOtherDots(index)
			this.drawLine();
		}
	}
	
	DeleteDotObject(index){
		this.dots[index].image.destroy();
		this.dots[index].text.destroy();
		this.dots[index].timeText.destroy();
	}
	
	RemoveAtDots(index){
		this.dots.splice(index, 1);
	}
	
	ReTextOfDot(){
		var noteDur = 0;
		if(this.dots.length != 0){
			for(var i = 0; i < this.dots.length; i++){
				
				noteDur += this.dots[i].duration;	
				this.dots[i].timeText.setText(noteDur);
			}
		}
		
	}
	
	ResetOtherDots(){
		for(var i = 0; i < this.dots.length; i++){
			this.dots[i].text.setText(i);
			this.dots[i].image.name = SetTypeOfImage(CST.TYPE.DOT, this.index, i);
		}

		this.ReTextOfDot();
	}
	
	drawLine(){
		this.debug.clear().lineStyle(4, 0x00ff00);

		for(var i = 0; i < this.dots.length - 1; i++){
			this.drawDotByDot(this.dots[i].pos.x, this.dots[i].pos.y, 
			this.dots[i + 1].pos.x, this.dots[i + 1].pos.y);
		}
	}
	
	drawDotByDot(pos1_x, pos1_y, pos2_x, pos2_y){
    	this.debug.lineBetween(pos1_x, pos1_y, pos2_x, pos2_y).setDepth(3);
	}
	
	ReturnLongNotePos(){
	
		var startIndex = this.indexOfLongNote[0].indexOfDot;
		var endIndex = this.indexOfLongNote[1].indexOfDot;
		
		var arrOfPos = [];

		for(var i = startIndex; i < endIndex; i++){

			var checkXEqual = this.dots[i].pos.x === this.dots[i + 1].pos.x;
			var checkYEqual = this.dots[i].pos.y === this.dots[i + 1].pos.y;

			var timesX = (this.dots[i + 1].pos.x - this.dots[i].pos.x) / 240;
			var timesY = (this.dots[i + 1].pos.y - this.dots[i].pos.y) / 240;

			var checkXTimes = Math.abs(timesX) > 1;
			var checkYTimes = Math.abs(timesY) > 1;

			if(i !== startIndex)
				arrOfPos.push({x: this.dots[i].pos.x, y: this.dots[i].pos.y})

								//y만 배수
			if(checkXEqual && checkYTimes){
				for(var j = 1; j < Math.abs(timesY); j++){
					if(timesY < 0){
						arrOfPos.push({x: this.dots[i].pos.x, y: -240 * j + this.dots[i].pos.y});
					}else{
						arrOfPos.push({x: this.dots[i].pos.x, y:240 * j + this.dots[i].pos.y});
					}
				}
								//x만 배수
			}else if(checkYEqual && checkXTimes){
				for(var j = 1; j < Math.abs(timesX); j++){
					if(timesX < 0){
						arrOfPos.push({x: -240 * j + this.dots[i].pos.x, y: this.dots[i].pos.y});
					}else{
						arrOfPos.push({x: 240 * j + this.dots[i].pos.x, y: this.dots[i].pos.y});
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

					arrOfPos.push({x: 240 * j * k + this.dots[i].pos.x, y: 240 * j * z + this.dots[i].pos.y});
				}
			}
		}
		return arrOfPos;
	}

}

function returnRoundTarget(target){
	return Math.round(target / 240) * 240;
}



function SetTypeOfImage(string, indexOfLine, indexOfDot){
	var data = { TYPE: string, INDEXOFLINE: indexOfLine, INDEXOFDOT: indexOfDot}
	return data;
}