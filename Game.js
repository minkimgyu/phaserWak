import {LoadScene} from './Scenes/LoadScene.js';          
import {MenuScene} from './Scenes/MenuScene.js';
import {PlayScene} from './Scenes/PlayScene.js';

var config = {
	width: 800,
	height: 600,
	backgroundColor: 0x000000,
	type: Phaser.AUTO,
	physics: {
        default: 'arcade'
    },
	scene:[LoadScene, MenuScene, PlayScene]
}

var game = new Phaser.Game(config);

//dkekdkkekekdk