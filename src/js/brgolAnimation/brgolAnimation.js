var SVG = require('svg.js');
var TWEEN = require('@tweenjs/tween.js');
var Signals = require('mini-signals');
var rawObjects = require('./rawObjects');


module.exports = function(events){
	var stage = {
		width:595,
		height:375,
	}

	var draw = SVG('brgol-animation').size(stage.width, stage.height);
	var mainGroup = draw.group();

	// draw.attr({
	// 	'borderRadius':'10px'
	// })

	var img1 = mainGroup.group().svg(rawObjects.img1);
	var img2 = mainGroup.group().svg(rawObjects.img2);

	var setAnimation = function(){
		var objects = [img1,img2];
		var showObject = function(id){
			var duration = 700;
			var delay = 3000;
			var otherId = (id==0 ? 1 : 0);
			var object = objects[id];
			var otherObject =  objects[otherId];
			var value = {v:0};

			object.attr({opacity:0});

			otherObject.attr({opacity:1});
			otherObject.back();

			new TWEEN.Tween(value)
			.to({v:1},duration)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(function(){
				object.attr({opacity:value.v});
			})
			.onComplete(function(){
				setTimeout(function(){
					showObject(otherId);
				},delay);
			})
			.start();
		}

		showObject(0);
	}();
}
