import {CST} from "../CST.js";                  

var debug;
var source;
var target = new Phaser.Math.Vector2();
var distanceText;

var timer = 0;
var timeText;



export class PlayScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.PLAY
		})
	}
	
	
	
	init(data){
		console.log(data)
	}
	preload(){
		this.load.image('Wak', './Images/111.png');
	}
	create(){
		
	var image =	this.add.image(100, 100, 'Wak');
		
		var timeline = this.tweens.createTimeline();
    //timer.start();
		
		timeline.add({
        targets: image,
        x: 600,
        ease: 'Linear',
        duration: 1000,  //     1초 600px
        flipX: true
    });

timeline.add({
        targets: image,
        y: 500,
        ease: 'Power1',
        duration: 3000
    });

timeline.add({
        targets: image,
        x: 100,
        ease: 'Power1',
        duration: 3000
    });


timeline.add({
        targets: image,
        y: 100,
        ease: 'Power1',
        duration: 3000
    });

timeline.play();
		
		
		////
		
		source = this.physics.add.image(100, 100, 'Wak');
    	debug = this.add.graphics();
    	this.input.on('pointerdown', function (pointer) {

        target.x = pointer.x;
        target.y = pointer.y;
        
        // Move at 200 px/s:
        this.physics.moveToObject(source, target, 1000);

        debug.clear().lineStyle(1, 0x00ff00);
        debug.lineBetween(0, target.y, 800, target.y);
        debug.lineBetween(target.x, 0, target.x, 600);

    }, this);

    distanceText = this.add.text(10, 10, 'Click to set target', { fill: '#00ff00' });
    
    //timeText = this.add.text(10, 30, 'time', { fill: '#00ff00' });
	}
	update(){
	  
	 // timeText.setText('Distance: ' + timer.duration.toFixed(0));
	  
		 var distance = Phaser.Math.Distance.Between(source.x, source.y, target.x, target.y);

    if (source.body.speed > 0)
    {
        distanceText.setText('Distance: ' + distance);

        //  4 is our distance tolerance, i.e. how close the source can get to the target
        //  before it is considered as being there. The faster it moves, the more tolerance is required.
       // if (distance <= 3)
       // {
        //    source.body.reset(target.x, target.y);
			//awdawdaqwd
      //  }
    }
	}
}