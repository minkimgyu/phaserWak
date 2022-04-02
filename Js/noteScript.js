import {CST} from "../CST.js";                  

export class Note {
	constructor (loadGame, pos, duration, image, judgeText, indexOfDot, type, keyCode) { 
		this.loadGame = loadGame;
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
		this.longNoteIndex = -1;
	}
	
	setLongNoteIndex(index){
		this.longNoteIndex = index;
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
		if(this.type === CST.TYPE.NOTE){
			this.noteJudge(nowTime);
		}else if(this.type === CST.TYPE.LONGNOTEHEAD){
			this.noteJudge(nowTime);
		}else if(this.type === CST.TYPE.LONGNOTEMINI){
			this.longNoteJudge(nowTime);
		}else if(this.type === CST.TYPE.LONGNOTETAIL){
			this.longNoteJudge(nowTime);
		}
		
		
	}
	
	noteJudge(nowTime){
		if(this.keyCode.isDown){
			if(this.judgeOnce)
				return;

		var minTime = parseFloat(this.duration) -  parseFloat(this.addTime);
		var maxTime =  parseFloat(this.duration) +  parseFloat(this.addTime);

			if(nowTime >= minTime && nowTime <= maxTime){
				var cur = Math.abs(nowTime - this.duration);

				var rank = "";

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
	}
	
	longNoteJudge(nowTime){
		
		if(this.judgeOnce)
			return;
		
		var rank;
		
		if(nowTime < parseFloat(this.duration)){
			if(this.keyCode.isUp){
				this.loadGame.noteContainer.SetMissForAllLongNotes(this.longNoteIndex);
			}
		}else{
			rank = "perfect";
			this.judgeText.setText(rank);
			this.judgeOnce = true;
		}
	}
}
export class NoteContainer{
	constructor (loadGame) { 
		this.loadGame = loadGame;
		this.notes = [];
		this.longNoteCount = 0;
	}
	
	judgeNote(){
		var nowTime = this.loadGame.lineContainer.timer.getElapsedSeconds().toFixed(3)
		var addTime = 0.5;
		
		var sortArr = this.sortNotes();
		
		var nowCanJudgeMinTime = parseFloat(nowTime) - parseFloat(addTime);
		var nowCanJudgeMaxTime = parseFloat(nowTime) + parseFloat(addTime);
		var nowCanJudgeNotes = [];
		
		for(var i = 0; i < sortArr.length; i++){
			
			if(sortArr[i].duration > nowCanJudgeMaxTime)
				break;
			
			if(sortArr[i].duration < nowCanJudgeMinTime){
				if(sortArr[i].judgeOnce === false){
					
					if(sortArr[i].type === CST.TYPE.LONGNOTEHEAD){
						this.loadGame.noteContainer.SetMissForAllLongNotes(sortArr[i].longNoteIndex);
					}else{
						var rank = "miss";
						sortArr[i].judgeText.setText(rank);
						sortArr[i].judgeOnce = true;
					}
				}
			}
			
			if(nowCanJudgeMinTime <= sortArr[i].duration && sortArr[i].duration <= nowCanJudgeMaxTime){
				nowCanJudgeNotes.push(sortArr[i]);
			}
		}
		
		for(var i = 0; i < nowCanJudgeNotes.length; i++){
			nowCanJudgeNotes[i].judge(nowTime);
		}
	}
	
	clearJudge(){
		for(var i = 0; i < this.notes.length; i++){
			this.notes[i].judgeText.setText("");
			this.notes[i].judgeOnce = false;
 		}
	}
	
	sortNotes(){
		var arr = [];
		for(var i = 0; i < this.notes.length; i++){
			arr.push(this.notes[i]);
		}
		
		arr.sort(function(a, b) {
		  return a.duration - b.duration
		});
		
		return arr;
	}
	
	findIndexOfNote(index){
		var arr = [];
		
		 for(var i = 0; i < this.notes.length; i++){
			 if(this.notes[i].longNoteIndex === index){
				 
				var noteInfo = {index: i, note: this.notes[i]};
				arr.push(noteInfo);
			 }
		 }
		
		return arr;
	}
	
	SetMissForAllLongNotes(index){
		var arr = this.findIndexOfNote(index);
		
		for(var i = 0; i < arr.length; i++){
			
			if(arr[i].note.judgeOnce === false){
				var rank = "miss";
			 	arr[i].note.judgeText.setText(rank);
			 	arr[i].note.judgeOnce = true;
			}
		}
	}
	
	addNote(target){
		var xRound = returnRoundTarget(target.x);
		var yRound = returnRoundTarget(target.y);

		console.log("nowreturn")
		
		if(this.loadGame.lineContainer.canReturnSelectLine() === false){
			console.log("nowreturn")
			return;
		}
			
		console.log("nowreturn1")
		var nowLine = this.loadGame.lineContainer.returnSelectLine();
		
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
			var newNote = new Note(this.loadGame, {x: xRound, y: yRound}, 
			noteDur, image, judgeText, index, CST.TYPE.NOTE, this.loadGame.keys.Space)
			this.notes.push(newNote);
			newNote.image.setInteractive();
		}
	}
	
	addLongNote(target){
		var xRound = returnRoundTarget(target.x);
		var yRound = returnRoundTarget(target.y);

		var index = -1;
		
		if(this.loadGame.lineContainer.canReturnSelectLine() === false)
			return;
		
		var nowLine = this.loadGame.lineContainer.returnSelectLine();

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
			

			if(nowLine.returnLongNoteData() === 0){
				image.name = SetTypeOfImage(CST.TYPE.LONGNOTEHEAD, this.notes.length);
			}else if(nowLine.returnLongNoteData() === 1){
				image.name = SetTypeOfImage(CST.TYPE.LONGNOTETAIL, this.notes.length);
			}
			
			
			var judgeText = this.loadGame.add.text(xRound + 70, yRound + 50, "")
			.setFont('20px Arial').setColor('#00FFFF').setAlign('center');
			var newNote = new Note(this.loadGame, {x: xRound, y: yRound}, 
			noteDur, image, judgeText, index, CST.TYPE.NOTE, this.loadGame.keys.Space)
			this.notes.push(newNote);
			newNote.image.setInteractive();

			var nowCount = nowLine.addLongNote(newNote);
			
			if(nowCount){
				
				this.longNoteCount += 1;
				
				var arr = nowLine.returnLongNote()
				
				arr[0].setLongNoteIndex(this.longNoteCount)
				arr[0].type = CST.TYPE.LONGNOTEHEAD;
				
				arr[1].setLongNoteIndex(this.longNoteCount)
				arr[1].type = CST.TYPE.LONGNOTETAIL;
				var pos = nowLine.ReturnLongNotePos();

				var startDur = parseFloat(arr[0].duration);
				var endDur = parseFloat(arr[1].duration);
				
				var count = pos.length + 1;
				var temp = endDur - startDur;
				
				var perPos = temp / count;
				
				console.log(perPos)
				
				for(var j = 0; j < pos.length; j++){

					var noteDur = 0;
					if(nowLine.dots.length != 0){
						noteDur =  startDur + perPos * (j + 1);
					}

					var image = this.loadGame.add.image(pos[j].x, pos[j].y, 'note2').setDepth(0);
					image.name = SetTypeOfImage(CST.TYPE.LONGNOTEMINI, this.notes.length);

					var judgeText = this.loadGame.add.text(pos[j].x + 70, pos[j].y + 50, "")
					.setFont('20px Arial').setColor('#00FFFF').setAlign('center');
					var newNote = new Note(this.loadGame, {x: pos[j].x, y: pos[j].y}, 
					noteDur, image, judgeText, index, CST.TYPE.LONGNOTEMINI, this.loadGame.keys.Space)
					this.notes.push(newNote);
					newNote.image.setInteractive();
					newNote.setLongNoteIndex(this.longNoteCount);
				}
				
				
				
				console.log(this.notes)
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
			
			if(note.type === CST.TYPE.NOTE){
				this.notes[index].image.destroy();
				this.notes[index].judgeText.destroy();
				this.notes.splice(index, 1);

				note = null;

				// 이미지 순서 초기화
				for(var i = 0; i < this.notes.length; i++){
					this.notes[i].image.name = SetTypeOfImage(CST.TYPE.NOTE, i);
				}
			}else{
				
				var arr = this.findIndexOfNote(note.longNoteIndex);
				
				for(var i = this.notes.length - 1; i >= 0; i--){
					
					if(note.longNoteIndex === this.notes[i].longNoteIndex){
						this.notes[i].image.destroy();
						this.notes[i].judgeText.destroy();
						this.notes.splice(i, 1);
						
						// console.log(i)
						// console.log(this.notes)
					}
				}
				
				// 이미지 순서 초기화
				for(var i = 0; i < this.notes.length; i++){
					this.notes[i].image.name = SetTypeOfImage(CST.TYPE.NOTE, i);
				}
				
				if(this.loadGame.lineContainer.canReturnSelectLine() === false)
					return;
		
				var nowLine = this.loadGame.lineContainer.returnSelectLine();
				nowLine.clearLongNote();
			
			}
			
			 console.log(this.notes)
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