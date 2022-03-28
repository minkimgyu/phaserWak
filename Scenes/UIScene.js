import {CST} from "../CST.js"; 

var valuebar0;
var loadGame;
var PlayScene;

var inputfield;
var ui;

var text;

var field;
var button;

var panel;
var slider;

var modeText;
var selectedLineText;

class Button {
   constructor (pos, width, height, fontSize) { 
		this.But = loadGame.add.dom(pos.x, pos.y).
		createElement("button").setOrigin(0);
		
		var style = this.But.node.style;
		style.fontSize = fontSize + "px";
		style.width = width + "px";
		style.height = height + "px";
	   	style.font = "20px Arial";
		style.backgroundColor = "rgba(106, 161, 210, 0.58)"	  
	   
	   	this.But.node.innerText = '메뉴창';
	}
}

class Panel{
	constructor (pos, texts = ["X", "Y", "Index", "Time"]) { 
		this.panel = loadGame.add.dom(pos.x, pos.y).createFromCache("form2").setOrigin(0);
		this.value = null;
		
		this.text = this.panel.getChildByID("text");
		this.text1 = this.panel.getChildByID("text1");
		this.text2 = this.panel.getChildByID("text2");
		this.text3 = this.panel.getChildByID("text3");
		this.text4 = this.panel.getChildByID("text4");
		
		this.x_text = this.panel.getChildByID("x");
		this.y_text = this.panel.getChildByID("y");
		this.index_text = this.panel.getChildByID("index");
		this.time_text = this.panel.getChildByID("time");
		
		this.text1.innerText = texts[0] + ": ";
		this.text2.innerText = texts[1] + ": ";
		this.text3.innerText = texts[2] + ": ";
		this.text4.innerText = texts[3] + ": ";
		
		this.panel.addListener('click');
		this.panel.setVisible(false);
		
		this.index_text.disabled = true; 
	}
	
	SetOnOffPanel(bool){
		this.panel.setVisible(bool);
	}
	
	SetData(value, type){
		
		this.SetDisable(type)
		this.type = type;
		
		if(type === CST.TYPE.DOT){
			var indexOfLine = value.image.name.INDEXOFLINE;
			var indexOfDot = value.image.name.INDEXOFDOT;
			
			this.index = value.image.name.INDEXOFDOT;
			
			this.SetMainName("Line " + indexOfLine + " " + type + " " + indexOfDot);
			this.x_text.value = value.pos.x;
			this.y_text.value = value.pos.y;
			this.index_text.value = indexOfDot;
			this.time_text.value = value.duration;
		}else{
			var index = value.image.name.INDEX;
			
			this.index = index;
			
			this.SetMainName(type + " " +index);
			this.x_text.value = value.pos.x;
			this.y_text.value = value.pos.y;
			this.index_text.value = index;
			this.time_text.value = value.duration;
		}
	}
	
	SetDisable(type){
		if(type === CST.TYPE.DOT){
			this.x_text.disabled = false;
			this.y_text.disabled = false;
			this.index_text.disabled = true; 
			this.time_text.disabled = false; 
		}else if(type === CST.TYPE.NOTE){
			this.x_text.disabled = true;
			this.y_text.disabled = true;
			this.index_text.disabled = true; 
			this.time_text.disabled = true; 
		}
	}
	
	ResetData(){
		this.value = {pos:{x: parseInt(this.x_text.value), 
						   y: parseInt(this.y_text.value)}, 
					  duration:parseInt(this.time_text.value)};
	}
	
	SetMainName(name){
		this.text.innerText = name;
	}
}

class SliderBar{
	constructor (pos) { 
		this.Slider = loadGame.add.dom(pos.x, pos.y).createFromCache("form1").setOrigin(0);
		this.Slider.addListener('click');
		//this.Slider.setVisible(false);
	}
}

export class UIScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.UI
		})
	}
	
		
	init(data){
		loadGame = this;
		PlayScene = loadGame.scene.get("PLAY")
	}
	preload(){
		this.load.image('ui', './Images/ui.png');
		this.load.html("form1", "./Forms/form1.html");
		this.load.html("form2", "./Forms/form2.html");
	}
	create(){
		
		
		
		panel = new Panel({x:10, y:222});
		panel.panel.on('click', function (event) {
			if(event.target.id === "close"){
				panel.SetOnOffPanel(false);
			}else if(event.target.id === "add"){
				panel.ResetData();
				PlayScene.changeValue(panel.type, panel.index, panel.value);
			}
		});
		
		var but1 = new Button({x: 10, y: 10}, 100, 40, 10)
		but1.But.node.onclick= function(){
			var now = slider.Slider.visible;
			slider.Slider.setVisible(!now);
	    } 
		
		text = this.add.text(480, 50, "")
		.setFont('30px Arial').setColor('#00FFFF').setAlign('center');
		
		slider = new SliderBar({x:760, y:0});
		slider.Slider.on('click', function (event) {
			if(event.target.tagName === "BUTTON"){
				//console.log(event.target.id)
				PlayScene.setMode(event.target.id);
				loadGame.SetModeText(event.target.id);
			}
		});
		
		modeText = loadGame.add.text(10, 80, "")
		.setFont('30px Arial').setColor('#00FFFF').setAlign('center');
		loadGame.SetModeText(CST.MODE.IDLE);
		
		selectedLineText = loadGame.add.text(10, 120, "")
		.setFont('20px Arial').setColor('#00FFFF').setAlign('center');
		loadGame.SetModeText(CST.MODE.IDLE);
	}
	
	SetselectedLineText(index){
		selectedLineText.setText("Line" + index);
	}
	
	SetClearLineText(){
		selectedLineText.setText("");
	}
	
	SetModeText(mode){
		modeText.setText(mode);
	}
	
	SetPanel(value, type, index){
		panel.SetOnOffPanel(true);
		panel.SetData(value, type, index);
	}
	
	SetTimes(value){
		text.setText("Times: " + value);
	}
}