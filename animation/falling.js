/*
Author:Carrie Jiang
A falling ball that imitates a falling object in real life
*/

var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	
	fps = 60,
	
	GRAVITY_FORCE = 9.81,  // 9.81 m/s/s
	pixelsPerMeter = canvas.height / 10,
	
	
	timer = new Timer(),
	ballPainter = {
		paint:function( sprite, context ){
		//
		 context.clearRect( 0, 0, canvas.width, canvas.height );
			var x = sprite.left + sprite.width/2,
				y = sprite.top + sprite.height/2,
				radius = sprite.width/2;
				//
			context.save();
			context.beginPath();
			context.arc( x, y, radius, 0, Math.PI*2, false);
			//filling should be before stroking to prevent filling shadow stroking
			context.fillStyle = 'rgba(218,165,32,0.1)';
			context.fill();
		  
			context.lineWidth = 1;
			context.strokeStyle = 'rgb(100,100,195)';
			context.stroke();
			context.restore();
				
		}
	},
	falling = {
		execute: function( sprite, context, time ){
			if( sprite.top < canvas.height){
				sprite.lastTop = sprite.top;
				sprite.top +=  sprite.velocityY / fps;
				//
			sprite.velocityY = GRAVITY_FORCE * timer.getElapsedTime()/1000 * pixelsPerMeter;
			}else{
				stop();
			}
		}
	},
	
	fallingBallSprite = new Sprite( "fallingBall", ballPainter, [ falling ] );
	
	//Initializing the ball
	fallingBallSprite.left = canvas.width/2;	
	fallingBallSprite.width = 40;
	fallingBallSprite.height = 40;
	
	var animate = function( time ){
		           
		if(timer.running){
		//
			fallingBallSprite.paint();
			fallingBallSprite.update( time );
			window.requestNextAnimationFrame( animate );
			
		}
	}
	var start = function (){
		timer.start();
	
		window.requestNextAnimationFrame( animate );
	}
	var stop = function (){
		timer.stop();
		fallingBallSprite.top = 0;
		setTimeout(function(){fallingBallSprite.paint();}, 500);
	}

	start();
	
	