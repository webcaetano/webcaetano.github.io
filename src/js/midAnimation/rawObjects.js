var self = {};

self.planet = `
<g id="planet" transform="matrix( 1, 0, 0, 1, 0,0) ">
	<image x="-172.00" y="-170.50" width="344" height="341" xlink:href="./images/moon.png"/>
</g>
`;

self.moon = `
<g id="moon" transform="matrix( 0.45, 0, 0, 0.45, 0,0) ">
	<image x="-55.00" y="-55.00" width="110" height="110" xlink:href="./images/meteor.png"/>
</g>
`;

self.alien = `
<g id="alien" transform="matrix( 1, 0, 0, 1, 0,0) ">
	<image x="-57.5" y="-63" width="115" height="126" xlink:href="./images/alien.png"/>
</g>
`;

self.alienArmRight = `
<g id="alienArm" transform="matrix( 1, 0, 0, 1, 0,0) ">
	<image x="-5" y="-34" width="43" height="41" xlink:href="./images/arm_right.png"/>
</g>
`;

self.alienArmLeft = `
<g id="alienArm" transform="matrix( -1, 0, 0, 1, 0,0) ">
	<image x="5" y="-34" width="43" height="41" xlink:href="./images/arm_right.png"/>
</g>
`;

self.ring1 = `
<g transform="matrix( 1, 0, 0, 1, 0,0) ">
	<image x="-351" y="-100" width="702" height="200" xlink:href="./images/ring_1.png"/>
</g>
`;

self.ring2 = `
<g transform="matrix( 1, 0, 0, 1, 0,0) ">
	<image x="-351" y="-100" width="702" height="200" xlink:href="./images/ring_2.png"/>
</g>
`;

self.ring3 = `
<g transform="matrix( 1, 0, 0, 1, 0,0) ">
	<image x="-351" y="-100" width="702" height="200" xlink:href="./images/ring_3.png"/>
</g>
`;

	// <image width="43" height="41" xlink:href="./images/alien_arm.png"/>

module.exports = self;
