import {CST} from "../CST.js";                  

var debug;
var source;
var target = new Phaser.Math.Vector2();
var distanceText;



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
	}
	update(){
		 var distance = Phaser.Math.Distance.Between(source.x, source.y, target.x, target.y);

    if (source.body.speed > 0)
    {
        distanceText.setText('Distance: ' + distance);

        //  4 is our distance tolerance, i.e. how close the source can get to the target
        //  before it is considered as being there. The faster it moves, the more tolerance is required.
        if (distance < 10)
        {
            source.body.reset(target.x, target.y);
			//awdawdaqwd
        }
    }
	}
}