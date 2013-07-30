var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	
	timeWarp,
	lastTime,
	timer = new AnimationTimer( 2000 ),
	counter=0,
	ballPainter = {
		paint:function( sprite, context ){	
		//context.clearRect( 0, 0, canvas.width, canvas.height );
		var x = sprite.left + sprite.width/2,
		y = sprite.top + sprite.height/2,
		radius = sprite.width/2;
		//
		context.save();
		context.beginPath();
		context.arc( x, y, radius, 0, Math.PI*2, false);
		//filling should be before stroking to prevent filling shadow stroking
		context.fillStyle = 'yello';
		context.fill();

		context.lineWidth = 1;
		context.strokeStyle = 'rgb(100,100,195)';
		context.stroke();
		context.restore();

		}
	},	
	action = {
		execute: function( sprite, context, time ){
			if(sprite.left >= platform.left && sprite.left < platform.left + platform.width ){
				var elapsed,
				thisTime =  timer.getElapsedTime( timeWarp );
				if( lastTime != undefined ){
					if( !timer.isOver() ){
						elapsed =  thisTime - lastTime;
						sprite.left += sprite.velocityX * elapsed/1000;
						
						//console.log(sprite.left);
						}
					}else{
						
						stop();
					context.clearRect( 0, 0, canvas.width, canvas.height );
					ball.paint();
					platform.paint();
					}
			lastTime = thisTime;
			}
			else{
			sprite.left = platform.left;
			stop();
			context.clearRect( 0, 0, canvas.width, canvas.height );
			ball.paint();
			platform.paint();
			}
		}
	},
	pfPainter = {
		paint:function( sprite, context ){
			context.save();
			
			context.fillStyle = "#E01B6D" ;
			//context.fillRect(0,0,40,10);
			//console.log(  sprite.top, sprite.left, sprite.width, sprite.height);
			context.fillRect(sprite.left, sprite.top, sprite.width, sprite.height);
			context.restore();
		}
	},
	nextAnimation,
	animate = function( time ){
		if(timer.running ){
			context.clearRect( 0, 0, canvas.width, canvas.height );
			ball.paint();
			ball.update(context, time);
			
			platform.paint();
			platform.update( context, time );
			nextAnimation = window.requestNextAnimationFrame( animate);
			counter++;
			}
	},
	start = function(){
		//console.log(timeWarp);
		timer.start();
		nextAnimation = window.requestNextAnimationFrame( animate);
	},
	
	stop = function() {
	//console.log("stop");
		timer.reset();
		window.cancelRequestAnimFrame(nextAnimation);
		
	};
	//to do
	pause = function(){
		timer.stop();
		window.cancelRequestAnimFrame(nextAnimation);
	}
	platform = new Sprite( "platform", pfPainter,[] ),
	ball = new Sprite("ball", ballPainter, [ action ]);
	//initialization
	platform.width = 600;
	platform.height = 30;
	platform.top = (canvas.height - platform.height)/2;
	platform.left = (canvas.width- platform.width)/2;
	
	
	ball.width = 40;      
	ball.height = 40;
	ball.velocityX = 150;
	ball.velocityY = 0;
	ball.top =  platform.top -ball.height;
	ball.left = canvas.width/2 - platform.width/2 ;
	
	//platform.paint();
	//ball.paint();
	
	//console.log(platform.top, ball.top);
	 
	//window.requestNextAnimationFrame( animate);

	var btns = document.getElementsByName("motion");
	//console.log(btns);
	
		for (var i = 0; i < btns.length; i++) {
			var button = btns[i];
			button.onclick = function(e){
				var target = e.target || e.srcElement;
				
				if( target.value == 1 ){
					timeWarp =  AnimationTimer.linear();
				}else if( target.value == 2 ){
				log("here");
					timeWarp = AnimationTimer.easeIn( 2 );
				}else if( target.value == 3 ){
					timeWarp =  AnimationTimer.easeOut( 6);
				}else if( target.value == 4 ){
					timeWarp =  AnimationTimer.easeInOut();
				
				}else if( target.value == 5){
					timeWarp =  AnimationTimer.elastic( 4 );
				}
				else if( target.value == 6 ){
					timeWarp =  AnimationTimer.bounce( 5);
				}
				else{
					timeWarp =  AnimationTimer.linear();
				}							
				start();
			}
			
		}
	btns[4].click();
	var log = function( arg ){
	//console.log(arg);
};
	