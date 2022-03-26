import {LoadScene} from './Scenes/LoadScene.js';          
import {MenuScene} from './Scenes/MenuScene.js';
import {PlayScene} from './Scenes/PlayScene.js';
import {TestScene} from './Scenes/TestScene.js';
import {UIScene} from './Scenes/UIScene.js';
import {BuildScene} from './Scenes/BuildScene.js';

var config = {
	width: 960, // 960
	height: 540, // 540
	dom: {
        createContainer: true
    },
	backgroundColor: 0x000000,
	//antialias: false,
	//pixelArt: true,
	parent: "game", // https://www.thepolyglotdeveloper.com/2020/09/accept-text-input-user-phaser-game/
	type: Phaser.AUTO,
	physics: {
        default: 'arcade'
    },
	scene:[LoadScene, MenuScene, PlayScene, TestScene, UIScene, BuildScene],
	scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
	},
}

var game = new Phaser.Game(config);