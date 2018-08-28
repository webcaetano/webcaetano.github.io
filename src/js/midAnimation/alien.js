var SVG = require('svg.js');
var TWEEN = require('@tweenjs/tween.js');
var Signals = require('mini-signals');
var rawObjects = require('./rawObjects');
var _ = require('lodash');

module.exports = function(group,stage){
	var alien = group.group()
	alien.inside = alien.group();
	// after arms setup
	alien.inside.transform({scale:0.6});
	alien.inside.rotate(-23);

	alien.move((stage.width/2)-50,(stage.height/2)-105);

	var alienBody = alien.inside.group().svg(rawObjects.alien);

	var armRight = alien.inside.group().svg(rawObjects.alienArmRight);
	armRight.move(25,0);

	var armLeft = alien.inside.group().svg(rawObjects.alienArmLeft);
	armLeft.move(-13,0);

	armRight.attr({
		'transform-origin':String(-21.50+(5))+'px '+String(-20.50+(34))+'px' // crappy pivot setup
	});

	armLeft.attr({
		'transform-origin':String((-21.50+(5))*-1)+'px '+String(-20.50+(34))+'px' // crappy pivot setup
	});

	_.each([
		{
			obj:armLeft,
			initalValue:-20,
			to:35,
			delay:0
		},
		{
			obj:armRight,
			initalValue:10,
			to:-25,
			delay:500
		},
	],function(val,i){
		val.obj.rotate(val.initalValue);
		var value = {v:val.initalValue};
		var duration = 800;

		setTimeout(function(){
			new TWEEN.Tween(value)
			.to({v:value.v+val.to},duration)
			.easing(TWEEN.Easing.Cubic.InOut)
			.repeat(Infinity)
			.yoyo(true)
			.onUpdate(function(){
				val.obj.rotate(value.v);
			})
			.start()
		},val.delay)
	});
}
