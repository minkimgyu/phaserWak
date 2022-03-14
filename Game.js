import {LoadScene} from './Scenes/LoadScene.js';          
import {MenuScene} from './Scenes/MenuScene.js';
import {PlayScene} from './Scenes/PlayScene.js';
import {TestScene} from './Scenes/TestScene.js';
import {UIScene} from './Scenes/UIScene.js';


var config = {
	width: 800,
	height: 600,
	backgroundColor: 0x000000,
	type: Phaser.AUTO,
	physics: {
        default: 'arcade'
    },
	scene:[LoadScene, MenuScene, PlayScene, TestScene, UIScene],
	scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
	},
}

var game = new Phaser.Game(config);