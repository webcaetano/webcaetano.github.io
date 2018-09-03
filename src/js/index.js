var Signals = require('mini-signals');
var TWEEN = require('@tweenjs/tween.js');

var events = {
	onTick:new Signals(),
}

var setTick = function(){
	var onTick = function(){
		window.requestAnimationFrame(function(time){
			events.onTick.dispatch(time);
			onTick();
		});
	}

	onTick();

	events.onTick.add((time)=> TWEEN.update(time));
}();


require('./midAnimation/midAnimation')(events);
require('./adsAnimation/adsAnimation')(events);

// var a = function(x=1){
// 	console.log(x)
// }

// a();


