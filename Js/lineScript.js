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
export var line = []

export function addLine(target){
	var xRound = returnRoundTarget(target.x);
	var yRound = returnRoundTarget(target.y);
	
	var Image = loadGame.add.image(xRound, yRound, 'dot').setDepth(0);
	
	var text = loadGame.add.text(xRound + 10, yRound - 50, line.length)
	.setFont('20px Arial').setColor('#00FFFF').setAlign('center');
	
	var noteDur = normalDur;
	
	if(line.length != 0){
		for(var i = 0; i < line.length; i++){
			noteDur += line[i].duration;
		}
	}
	      
	var timeText = loadGame.add.text(xRound + 10, yRound + 30, noteDur)
	.setFont('20px Arial').setColor('#FF1E1E').setAlign('center');

	Image.name = SetTypeOfImage(CST.TYPE.DOT, line.length);
	var newNote = new Dot({x: xRound, y: yRound}, normalDur, Image, text, timeText)
	
	line.push(newNote);
	newNote.image.setInteractive();
	drawNoteLine();
}

export function deleteLine(target){
	var xRound = returnRoundTarget(target.x);
	var yRound = returnRoundTarget(target.y);
	
	var index = -1;
	
	if(line.length <= 0)
		return;
	
	for(var i = 0; i < line.length; i++){
		if(line[i].pos.x === xRound && line[i].pos.y === yRound){
			index = i;
			break;
		}
	}
	
	if(index === -1){
		return;
	}else{
		
		deleteNote(target)
		
		line[index].image.destroy();
		line[index].text.destroy();
		line[index].timeText.destroy();
		line.splice(index, 1);
		
		for(var i = 0; i < line.length; i++){
			line[i].text.setText(i);
			line[i].image.name = SetTypeOfImage(CST.TYPE.DOT, i);
		}
		
		for(var i = 0; i < line.length; i++){
			
			var noteDur = normalDur;
			for(var j = 0; j < i; j++){
				noteDur += line[j].duration;
			}	
			line[i].timeText.setText(noteDur);
		}
		
		drawNoteLine();
	}
}

export function drawLine(){
	debug.clear().lineStyle(4, 0x00ff00);
	if(line.length >= 1)
		drawDotByDot(0, 0, line[0].pos.x, line[0].pos.y);
	
	for(var i = 0; i < line.length - 1; i++){
		drawDotByDot(line[i].pos.x, line[i].pos.y, 
		line[i + 1].pos.x, line[i + 1].pos.y);
	}
}

export function ReturnLongNotePos(){
	for(var i = 0; i < lines.length - 1; i++){
							
		var checkXEqual = lines[i].pos.x === lines[i + 1].pos.x;
		var checkYEqual = lines[i].pos.y === lines[i + 1].pos.y;
							
		var timesX = (lines[i + 1].pos.x - lines[i].pos.x) / 240;
		var timesY = (lines[i + 1].pos.y - lines[i].pos.y) / 240;
							
		var checkXTimes = Math.abs(timesX) > 1;
		var checkYTimes = Math.abs(timesY) > 1;
							
		//y만 배수
		if(checkXEqual && checkYTimes){
			for(var j = 1; j < Math.abs(timesY); j++){
				if(timesY < 0){
					console.log(lines[i].pos.x, -240 * j + lines[i].pos.y);

					loadGame.add.image(lines[i].pos.x, -240 * j + lines[i].pos.y, 'start').setDepth(5);
				}else{
					console.log(lines[i].pos.x, 240 * j + lines[i].pos.y);

					loadGame.add.image(lines[i].pos.x, 240 * j + lines[i].pos.y, 'start').setDepth(5);
				}
			}
		//x만 배수
		}else if(checkYEqual && checkXTimes){
			for(var j = 1; j < Math.abs(timesX); j++){
				if(timesX < 0){
					console.log(-240 * j + lines[i].pos.x, lines[i].pos.y);
					loadGame.add.image(-240 * j + lines[i].pos.x, lines[i].pos.y, 'start').setDepth(5);
				}else{
					console.log(240 * j + lines[i].pos.x, lines[i].pos.y);
					loadGame.add.image(240 * j + lines[i].pos.x, lines[i].pos.y, 'start').setDepth(5);
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

				console.log(240 * j * k + lines[i].pos.x, 240 * j * z + lines[i].pos.y);
				loadGame.add.image(240 * j * k + lines[i].pos.x, 240 * j * z + lines[i].pos.y, 'start').setDepth(5);
			}
		}
	}
}

function returnRoundTarget(target){
	return Math.round(target / 240) * 240;
}

function drawDotByDot(pos1_x, pos1_y, pos2_x, pos2_y){
    debug.lineBetween(pos1_x, pos1_y, pos2_x, pos2_y).setDepth(3);
}

function SetTypeOfImage(string, index){
	var data = { TYPE: string, INDEX: index }
	return data;
}

export function ab(){
	console.log("adwawdwadadawdaw")
}