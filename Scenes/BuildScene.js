import {CST} from "../CST.js";    

var parts = 8;
var path;
var curve;
var handles;
var graphics;
var ball;

export class BuildScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.BUILD
		})
	}
		
	init(data){
	}
	preload(){
		this.load.image('ball', './Images/111.png');
    	this.load.image('dragcircle', './Images/lineDot.png');
	}
	create(){
		handles = this.add.group();
    	ball = this.add.image(0, 0, 'ball').setDepth(1000);
    	path = { t: 0, vec: new Phaser.Math.Vector2() };
    	curve = new Phaser.Curves.Spline([ new Phaser.Math.Vector2(50, 300) ]);

    	var tween = this.tweens.add({
      	  targets: path,
        	t: 1,
        	ease: 'Sine.easeInOut',
        	duration: 500,
        	repeat: -1
    	});

    	var _this = this;

    	var createPointHandle = function (point)
    	{
        	var handle = handles.create(point.x, point.y, 'dragcircle', 0).setInteractive();

        	handle.setData('vector', point);

        	_this.input.setDraggable(handle);
    	};

    	createPointHandle(curve.points[0]);

    	this.input.on('pointerdown', function (pointer, gameObjects) {

        	//  Check we didn't click an existing handle
        	if (gameObjects.length > 0)
        	{
            	return;
        	}

        	var vec = curve.addPoint(pointer.x, pointer.y);

        	createPointHandle(vec);

        	parts += 8;

        	tween.stop();

        	path.t = 0;

        	tween = _this.tweens.add({
            	targets: path,
            	t: 1,
            	ease: 'Sine.easeInOut',
            	duration: 500 * (curve.points.length + 1),
            	repeat: -1
        	});

    	});

    	this.input.on('dragstart', function (pointer, gameObject) {

			gameObject.setFrame(1);

    	});

    	this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        	gameObject.x = dragX;
        	gameObject.y = dragY;

        	gameObject.getData('vector').set(dragX, dragY);

    	});

    	this.input.on('dragend', function (pointer, gameObject) {

        	gameObject.setFrame(0);

    	});

    	graphics = this.add.graphics();
	}
	update(){
		graphics.clear();
   		graphics.lineStyle(2, 0xffffff, 1);
    	curve.draw(graphics, parts);
    	curve.getPoint(path.t, path.vec);
    	ball.setPosition(path.vec.x, path.vec.y);
	}
}