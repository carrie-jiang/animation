/*
Author:Carrie Jiang
A Sprite is a graphical object, which have paint() and behaviors()
*/
var Sprite = function (name, painter, behaviors){
	if( name !== undefined ) 
	{	this.name = name;
	}else{
		throw new Error("Sprite(): name is required");
	}		
	if( painter !== undefined ) 
	{ 
		this.painter = painter;
	}else{
		throw new Error("Sprite(): painter is required");
	}
	//assign an empty array so that there will be no non-pointer exception
	this.behaviors = behaviors || [];
	
	
	this.top = 0;
	this.left = 0;
	this.width = 10;
	this.height = 10;
	this.velocityX = 0;
	this.velocityY = 0;
	this.visible = true;
	this.animating = false;	
}
Sprite.prototype.paint = function() {
	this.painter.paint( this, context );
}
Sprite.prototype.update = function( context, time ) {
	//go through behavior one by one
	
	for( var i = 0; i < this.behaviors.length; i++ ){
		this.behaviors[i].execute( this, context, time );
	}
}
