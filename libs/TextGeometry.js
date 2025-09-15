/**
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 * @author tschw
 */

THREE.TextGeometry = function ( text, parameters ) {

	parameters = parameters || {};

	var font = parameters.font;

	if ( ! font ) {

		console.error( 'THREE.TextGeometry: font parameter is required' );
		return new THREE.BufferGeometry();

	}

	var shapes = font.generateShapes( text, parameters.size );

	// translate parameters to ExtrudeGeometry API

	parameters.amount = parameters.height !== undefined ? parameters.height : 50;

	// defaults

	if ( parameters.bevelThickness === undefined ) parameters.bevelThickness = 10;
	if ( parameters.bevelSize === undefined ) parameters.bevelSize = 8;
	if ( parameters.bevelEnabled === undefined ) parameters.bevelEnabled = false;

	// Create ExtrudeGeometry instance properly for r128
	var extrudeGeometry = new THREE.ExtrudeGeometry( shapes, parameters );
	
	// Copy properties from ExtrudeGeometry to this TextGeometry
	this.attributes = extrudeGeometry.attributes;
	this.index = extrudeGeometry.index;
	this.boundingBox = extrudeGeometry.boundingBox;
	this.boundingSphere = extrudeGeometry.boundingSphere;
	this.groups = extrudeGeometry.groups;
	this.morphAttributes = extrudeGeometry.morphAttributes;
	this.morphTargetsRelative = extrudeGeometry.morphTargetsRelative;
	this.name = extrudeGeometry.name;
	this.userData = extrudeGeometry.userData;

	this.type = 'TextGeometry';

};

THREE.TextGeometry.prototype = Object.create( THREE.ExtrudeGeometry.prototype );
THREE.TextGeometry.prototype.constructor = THREE.TextGeometry;
