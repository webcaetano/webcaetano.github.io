var SVG = require('svg.js');
var TWEEN = require('@tweenjs/tween.js');
var Signals = require('mini-signals');
var rawObjects = require('./rawObjects');


module.exports = function(events){
	var stage = {
		width:750,
		height:350,
	}

	var draw = SVG('drawing').size(stage.width, stage.height);
	var mainGroup = draw.group();
	var group = mainGroup.group();

	var planet = group.group().svg(rawObjects.planet);
	planet.move(stage.width/2,stage.height/2);
	planet.scale(0.6,0.6)

	var moonOutside = group.group();
	var moon = moonOutside.group().svg(rawObjects.moon);
	moon.move(stage.width/2,stage.height/2);
	moonOutside.transform({rotation:-25});

	require('./alien')(group,stage);

	var setMoonSpin = function(){
		var value = {
			x:stage.width/2,
			y:stage.height/2,
			scale:1
		};

		var gap = {
			x:275,
			y:30,
			scale:0.25,
		}

		moon.x((stage.width/2)-(gap.x/2));
		value.x = value.x - (gap.x/2);

		var duration = 1500;

		var front = function(){
			new TWEEN.Tween(value)
			.to({scale:value.scale+gap.scale},duration/2)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(function(){
				moon.transform({scale:value.scale});
			})
			.onComplete(function(){
				new TWEEN.Tween(value)
				.to({scale:value.scale-gap.scale},duration/2)
				.easing(TWEEN.Easing.Quadratic.In)
				.onUpdate(function(){
					moon.transform({scale:value.scale});
				})
				.onComplete(function(){
				})
				.start();
			})
			.start();

			new TWEEN.Tween(value)
			.to({y:value.y+gap.y},duration/2)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(function(){
				moon.y(value.y);
			})
			.onComplete(function(){
				new TWEEN.Tween(value)
				.to({y:value.y-gap.y},duration/2)
				.easing(TWEEN.Easing.Quadratic.In)
				.onUpdate(function(){
					moon.y(value.y);
				})
				.start()
				.onComplete(function(){
					back();
					moonOutside.back();
				})
			})
			.start();

			new TWEEN.Tween(value)
			.to({x:value.x+gap.x},duration)
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.onUpdate(function(){
				moon.x(value.x);
			})
			.start();
		}

		var back = function(){
			new TWEEN.Tween(value)
			.to({scale:value.scale-gap.scale},duration/2)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(function(){
				moon.transform({scale:value.scale});
			})
			.onComplete(function(){
				new TWEEN.Tween(value)
				.to({scale:value.scale+gap.scale},duration/2)
				.easing(TWEEN.Easing.Quadratic.In)
				.onUpdate(function(){
					moon.transform({scale:value.scale});
				})
				.onComplete(function(){
				})
				.start();
			})
			.start();

			new TWEEN.Tween(value)
			.to({y:value.y-gap.y},duration/2)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(function(){
				moon.y(value.y);
			})
			.onComplete(function(){
				new TWEEN.Tween(value)
				.to({y:value.y+gap.y},duration/2)
				.easing(TWEEN.Easing.Quadratic.In)
				.onUpdate(function(){
					moon.y(value.y);
				})
				.start()
				.onComplete(function(){
					front();
					moonOutside.front();
				})
			})
			.start();

			new TWEEN.Tween(value)
			.to({x:value.x-gap.x},duration)
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.onUpdate(function(){
				moon.x(value.x);
			})
			.start();
		}

		front();
	}();

	var setFluctuate = function(){
		var value = {x:0,y:-10};
		var duration = 2000;

		mainGroup.y(value.y);

		new TWEEN.Tween(value)
		.to({y:value.y+20},duration)
		.easing(TWEEN.Easing.Cubic.InOut)
		.repeat(Infinity)
		.yoyo(true)
		.onUpdate(function(){
			mainGroup.y(value.y);
		})
		.start();
	}();

	var setRings = function(){
		var blink = function(obj,duration,callback){
			obj.attr({
				opacity:0,
			})
			var to = 1;
			var value = {v:0};

			new TWEEN.Tween(value)
			.to({v:to},duration)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.repeat(1)
			.yoyo(true)
			.onUpdate(function(){
				obj.attr({
					opacity:value.v,
				})
			})
			.onComplete(function(){
				if(callback) callback();
			})
			.start();
		}

		var ring1 = draw.group().svg(rawObjects.ring1);
		ring1.move(stage.width/2,(stage.height/2)+50);

		var ring2 = draw.group().svg(rawObjects.ring2);
		ring2.move(stage.width/2,(stage.height/2)+50);

		var ring3 = draw.group().svg(rawObjects.ring3);
		ring3.move(stage.width/2,(stage.height/2)+50);

		ring1.attr({
			opacity:0,
		})

		ring2.attr({
			opacity:0,
		})

		ring3.attr({
			opacity:0,
		})

		var multiBlink = function(){
			var duration = 400;
			blink(ring1,duration);

			setTimeout(function(){
				blink(ring2,duration);
			},250)

			setTimeout(function(){
				blink(ring3,duration);
			},250+125)
		}

		setInterval(function(){
			multiBlink();
		},5000)
	}();
}
