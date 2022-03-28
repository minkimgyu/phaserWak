import {CST} from "../CST.js";                  

export class Note {
	constructor (pos, duration, image, judgeText, indexOfDot, type, keyCode) { 
		this.pos = pos;
		this.duration = duration;
		this.image = image;
		this.judgeText = judgeText;
		this.judgeOnce = false;
		this.indexOfDot = indexOfDot;
		this.addTime = 0.5;
		this.type = type;
		this.head = true;
		
		this.pressed = false;
		this.keyCode = keyCode;
	}
	
	inputCheck(){
		if(this.pressed === false){
			if(this.keyCode.isDown){
				this.pressed = true;
				return true;
			}
			if(this.keyCode.isUp)
				this.pressed = false;

			return false;
		}else{
			if(this.keyCode.isUp)
				this.pressed = false;

			return false;
		}
	}
	
	judge(nowTime){
		checkType(nowTime);
	}
	
	checkType(nowTime){
		if(this.type === CST.TYPE.NOTE){
			if(inputCheck()){
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
		}
	}
}
export class NoteContainer{
	constructor (loadGame, lineContainer) { 
		this.loadGame = loadGame;
		this.notes = [];
		this.lineContainer = lineContainer;
		this.longNoteCount = 0;
		this.indexOfLongNote = [];
	}
	
	addNote(target){
		var xRound = returnRoundTarget(target.x);
		var yRound = returnRoundTarget(target.y);

		console.log("nowreturn")
		
		if(this.lineContainer.canReturnSelectLine() === false){
			console.log("nowreturn")
			return;
		}
			
		console.log("nowreturn1")
		var nowLine = this.lineContainer.returnSelectLine();
		
		var index = -1;

		for(var i = 0; i < nowLine.dots.length; i++){
			if(nowLine.dots[i].pos.x === xRound && nowLine.dots[i].pos.y === yRound){
				index = i;
				break;
			}
		}

		if(index === -1){
			return;
		}else{

			var noteDur = 0;
			if(nowLine.dots.length != 0){
				for(var i = 0; i <= index; i++){
					noteDur += nowLine.dots[i].duration;
				}
			}

			var image = this.loadGame.add.image(xRound, yRound, 'note').setDepth(0);
			image.name = SetTypeOfImage(CST.TYPE.NOTE, this.notes.length);

			var judgeText = this.loadGame.add.text(xRound + 70, yRound + 50, "")
			.setFont('20px Arial').setColor('#00FFFF').setAlign('center');
			//hex code 색상임
			var newNote = new Note({x: xRound, y: yRound}, 
			noteDur, image, judgeText, index, CST.TYPE.NOTE)
			this.notes.push(newNote);
			newNote.image.setInteractive();
		}
	}
	
	addLongNote(target){
		var xRound = returnRoundTarget(target.x);
		var yRound = returnRoundTarget(target.y);

		var index = -1;
		
		if(this.lineContainer.canReturnSelectLine() === false)
			return;
		
		var nowLine = this.lineContainer.returnSelectLine();

		for(var i = 0; i < nowLine.dots.length; i++){
			if(nowLine.dots[i].pos.x === xRound && nowLine.dots[i].pos.y === yRound){
				index = i;
				break;
			}
		}


		if(index === -1){  
			return;
		}else{
			var noteDur = 0;
			if(nowLine.dots.length != 0){
				for(var i = 0; i <= index; i++){
					noteDur += nowLine.dots[i].duration;
				}
			}

			var image = this.loadGame.add.image(xRound, yRound, 'note1').setDepth(0);
			image.name = SetTypeOfImage(CST.TYPE.LONGNOTE, this.notes.length);

			var judgeText = this.loadGame.add.text(xRound + 70, yRound + 50, "")
			.setFont('20px Arial').setColor('#00FFFF').setAlign('center');
			var newNote = new Note({x: xRound, y: yRound}, 
			noteDur, image, judgeText, index, CST.TYPE.LONGNOTE)
			this.notes.push(newNote);
			newNote.image.setInteractive();

			this.longNoteCount += 1;
			this.indexOfLongNote.push(index);

			if(this.longNoteCount === 2){

				if(this.lineContainer.canReturnSelectLine() === false){
					return;
				}
				
				var line = this.lineContainer.returnSelectLine();
				
				var pos = line.ReturnLongNotePos(this.indexOfLongNote[0], this.indexOfLongNote[1]);

				for(var j = 0; j < pos.length; j++){

					var noteDur = 0;
					if(nowLine.dots.length != 0){
						for(var i = 0; i <= index; i++){
							noteDur += nowLine.dots[i].duration;
						}
					}

					var image = this.loadGame.add.image(pos[j].x, pos[j].y, 'note2').setDepth(0);
					image.name = SetTypeOfImage(CST.TYPE.LONGNOTEMINI, this.notes.length);

					var judgeText = this.loadGame.add.text(pos[j].x + 70, pos[j].y + 50, "")
					.setFont('20px Arial').setColor('#00FFFF').setAlign('center');
					var newNote = new Note({x: pos[j].x, y: pos[j].y}, 
					noteDur, image, judgeText, index, CST.TYPE.LONGNOTEMINI)
					this.notes.push(newNote);
					newNote.image.setInteractive();
				}
			}
		}
	}
	
	deleteNote(target){
		var xRound = returnRoundTarget(target.x);
		var yRound = returnRoundTarget(target.y);

		var index = -1;

		if(this.notes.length <= 0)
			return;

		for(var i = 0; i < this.notes.length; i++){
			if(this.notes[i].pos.x === xRound && this.notes[i].pos.y === yRound){
				index = i;
				break;
			}
		}

		if(index === -1){
			return;
		}else{
			var note = this.notes[index];

			this.notes[index].image.destroy();
			this.notes[index].judgeText.destroy();
			this.notes.splice(index, 1);

			note = null;

			// 이미지 순서 초기화
			for(var i = 0; i < this.notes.length; i++){
				this.notes[i].image.name = SetTypeOfImage(CST.TYPE.NOTE, i);
			}
		}
	}
}

function returnRoundTarget(target){
	return Math.round(target / 240) * 240;
}



function SetTypeOfImage(string, index){
	var data = { TYPE: string, INDEX: index }
	return data;
}