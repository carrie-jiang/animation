
var fps = 60;
var canvas = document.getElementById('h_canvas'),
    context = canvas.getContext('2d'),	
	hillPainter = {
		paint:function( sprite, context ){
		
		   var fristImgWidth = sprite.imgWidth - sprite.scrollVal,	   
			cvsX = sprite.canvasWidth - fristImgWidth,
			secondImgWidth = sprite.scrollVal,
			imgX = fristImgWidth;
		   
		   //This is the core part 
		   context.drawImage(sprite.img,0,0,fristImgWidth, sprite.imgHeight, cvsX, sprite.cvsY, fristImgWidth, sprite.imgHeight );
		   context.drawImage(sprite.img,imgX,0,secondImgWidth, sprite.imgHeight, 0, sprite.cvsY, secondImgWidth, sprite.imgHeight  );
	
		}
	}, 
	
	rollHills ={ 
		execute: function(sprite, context, time){			  
			if( sprite.scrollVal + sprite.velocityX >= sprite.canvasWidth){
				sprite.scrollVal = 0;
			}
        sprite.scrollVal+= sprite.velocityX/fps;
	}},
	
	hillOne = new Sprite("hillOne", hillPainter,[rollHills] ),

	scrollImg = new Image();
	scrollImg.src = "images/hill_01_02.png";
		
	//initialization
	hillOne.img = scrollImg;
	hillOne.imageData = {};
	
	hillOne.cvsY = 400;
	hillOne.scrollVal = 1;
	hillOne.canvasWidth = canvas.width;//2000;
	hillOne.canvasHeight = canvas.height;//700;
	hillOne.imgWidth = hillOne.canvasWidth ;
    hillOne.imgHeight = 300;
	hillOne.velocityX = 60;
	
	var hillTwo = new Sprite("hillTwo", hillPainter,[rollHills] ),
	//load the image	
	img = new Image();
	img.src = "images/hill_7.png";
	
	//initialization
	hillTwo.img = img;
	
	hillTwo.cvsY = 180;
	hillTwo.scrollVal = 1;
	hillTwo.canvasWidth = canvas.width;//2000;
	hillTwo.canvasHeight = canvas.width;//700;
	hillTwo.imgWidth = hillTwo.canvasWidth ;
    hillTwo.imgHeight = 380;
	hillTwo.velocityX = 30;
	
	//the bird sprite object will be implemented slicely different because the image is a sprite sheet
	//we will represent the sprite sheet with an array of cells, each cell represents a image
	var SpriteSheetPainter = function (cells) {
		this.cells = cells || [];
		this.cellIndex = 0;
	};
	SpriteSheetPainter.prototype = {
		advance: function () {
			if (this.cellIndex == this.cells.length-1) {
				this.cellIndex = 0;
			}
			else {
				this.cellIndex++;
			}
		},
		paint: function (sprite, context) {
			//for(var i=0; i<14;i++){
			//var cell = this.cells[i]; 
			var cell = this.cells[this.cellIndex]; 
			//sprite.top+=300;
			//sprite.left +=300;
			//console.log(this.cellIndex);
			context.drawImage(sprite.img, cell.left, cell.top, cell.width, cell.height,sprite.left, sprite.top, cell.width, cell.height);			
		//}
		}
	};
	var flyBird={
		lastAdvance: 0,
		PAGEFLIP_INTERVAL: 150,
		execute: function(sprite, context, time){
		
			if (time - this.lastAdvance > this.PAGEFLIP_INTERVAL) {
				sprite.painter.advance();
				this.lastAdvance = time;
			}
			if( sprite.left > sprite.canvasWidth ){
				sprite.left = 0;
			}
			else{
				sprite.left += sprite.velocityX/fps;
			}
		}
		
	},
	cells =[
			//be very carefully with the following coordinate, if the the size of the element is bigger than the img, Chrome will not draw it
			{ left:30, top: 0, width: 165, height: 172 },
			{ left: 210, top: 0, width: 165, height: 172  },			
			{ left: 390, top: 0, width: 165, height: 172  },		
			{ left: 555, top: 0, width: 170, height: 172  },
			{ left: 730, top: 0, width: 180, height: 172  },
			
			{ left: 15, top: 168, width: 165, height: 172  },			
			{ left: 200, top: 168, width: 165, height: 172  },			
			{ left: 390, top: 168, width: 162, height: 170  },
			{ left: 560, top: 168, width: 165, height: 172  },	
			{ left: 754, top: 168, width: 162, height: 172  },
			 
			{ left: 30, top: 340, width: 165, height: 165  },
			{ left: 213, top: 340, width: 162, height: 165  },			
			{ left: 370, top: 340, width: 175, height: 165  },
			{ left: 546, top: 340, width: 178, height: 165  },
			
		],
	bird = new Sprite("bird" , new SpriteSheetPainter( cells ) , [flyBird]),
	birdImg = new Image();
	birdImg.src = "images/red_bird_2.png";
	bird.img = birdImg;
	bird.top =0;
	bird.left =0;
	bird.width = 200;
	bird.height = 150;
	bird.velocityX = 80;
	bird.canvasWidth = canvas.width;//2000;	
	
	//The Smurf Sprite
	SmurfCells =[
			{ left:50, top: 0, width: 200, height: 248 },
			{ left: 300, top: 0, width: 200, height: 248  },
			{ left: 550, top: 0, width: 200, height: 248  },			
			{ left: 800, top: 0, width: 200, height: 248  },
			// row 2
			{ left: 50, top: 250, width: 200, height: 248  },			
			{ left: 300, top: 250, width: 200, height: 248  },		
			{ left: 550, top: 250, width: 200, height: 248  },			
			{ left: 800, top: 250, width: 200, height: 248  },
			//row 3
			{ left: 50, top: 500, width: 200, height: 248  },			
			{ left: 300, top: 500, width: 200, height: 248  },			
			{ left: 550, top: 500, width: 200, height: 248  },
			{ left: 800, top: 500, width: 200, height: 248  },
			//row 4
			{ left: 50, top: 500, width: 200, height: 248  },
			{ left: 300, top: 500, width: 200, height: 248  },
			{ left: 550, top: 500, width: 200, height: 248  },
			{ left: 800, top: 500, width: 200, height: 248  },
			
			
		];
		
	var moveSmurf = {
		lastAdvance: 0,
		PAGEFLIP_INTERVAL: 150,
		execute: function(sprite, context, time){
		//console.log(time);
			if (time - this.lastAdvance > this.PAGEFLIP_INTERVAL) {
				sprite.painter.advance();
				this.lastAdvance = time;
			}
			if( sprite.left > sprite.canvasWidth ){
				sprite.left = 0;
			}
			else{
				sprite.left += sprite.velocityX/fps;
			}
		}
		
	}
	smurf = new Sprite("smurf" , new SpriteSheetPainter( SmurfCells ) , [moveSmurf]);
	
	smurfImg = new Image();
	smurfImg.src = "images/smurf_1.png";
	smurf.img = smurfImg;
	smurf.top = 495;
	smurf.left =0;
	smurf.width = 200;
	smurf.height = 150;
	smurf.velocityX = 90;
	smurf.canvasWidth = canvas.width;
	
	//Clouds Sprites
	var cloudPainter = {
		paint:function( sprite, context ){
			context.drawImage(sprite.img,0,0, sprite.width, sprite.height, sprite.left, sprite.top, sprite.width, sprite.height );
		}
	}, 
	
	moveCloud ={ 
		execute: function(sprite, context, time){		
			if( sprite.left + sprite.velocityX >= sprite.canvasWidth){
				sprite.left = -sprite.width;
			}
        sprite.left+= sprite.velocityX/fps;
	}},
	cloudOne = new Sprite("cloudOne" , cloudPainter, [moveCloud]),
	cloudOneImg = new Image();
	cloudOneImg.src = "images/cloud_small_1.png";
	cloudOne.img = cloudOneImg;
	cloudOne.top = 0;
	cloudOne.left = -cloudOne.width;
	cloudOne.width = 297;//400;
	cloudOne.height = 150;//240;
	cloudOne.velocityX = 20;
	cloudOne.canvasWidth = canvas.width; //2000;
	
	var cloudTwo = new Sprite("cloudTwo" , cloudPainter, [moveCloud]),
	cloudTwoImg = new Image();
	cloudTwoImg.src = "images/cloud_1.png";
	cloudTwo.img = cloudTwoImg;
	cloudTwo.top = 0;
	cloudTwo.left = 500;
	cloudTwo.width = 400;
	cloudTwo.height = 240;
	cloudTwo.velocityX = 20;
	cloudTwo.canvasWidth = canvas.width;//2000;
	
	var cloudThree = new Sprite("cloudThree" , cloudPainter, [moveCloud]);
	cloudThree.img = cloudOneImg;
	cloudThree.top = 40;
	cloudThree.left = 1000;
	cloudThree.width = 297;
	cloudThree.height = 150;
	cloudThree.velocityX = 60;
	cloudThree.canvasWidth = canvas.width;//2000;
	
	var cloudFour = new Sprite("cloudFour" , cloudPainter, [moveCloud]);
	cloudFour.img = cloudTwoImg;
	cloudFour.top = 45;
	cloudFour.left = 1500;
	cloudFour.width = 400;
	cloudFour.height = 240;
	cloudFour.velocityX = 80;
	cloudFour.canvasWidth = canvas.width;//2000;
	
	var forestPainter = cloudPainter ;
	forest =  new Sprite("forest" , forestPainter);
	forestImg = new Image();
	forestImg.src = "images/forest_7.png";
	forest.img =forestImg;
	forest.width = canvas.width; //2000;
	forest.height = 300;
	forest.left = 0;
	forest.top = 620;
	
	var counter =0;
function animate( time ) {
//for( counter; counter <400; counter++){//
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	hillTwo.paint();
	hillTwo.update();
	hillOne.paint();
	hillOne.update();
	
	cloudOne.paint();
	cloudOne.update(context, time);
	cloudTwo.paint();
	cloudTwo.update(context, time);
	cloudThree.paint();
	cloudThree.update(context, time);
	cloudFour.paint();
	cloudFour.update(context, time);
	bird.paint();
	bird.update( context, time);
	
	forest.paint();
	smurf.paint();
	smurf.update( context, time);
	
window.requestNextAnimationFrame( animate );	
//}
}//
animate( 0 );