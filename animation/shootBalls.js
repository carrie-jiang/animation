var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	scoreboard = document.getElementById('scoreboard'),
	launchAngleOutput = document.getElementById('launchAngleOutput'),
	launchVelocityOutput = document.getElementById('launchVelocityOutput'),
	elapsedTime = undefined,
	launchTime = undefined,
	score = 0,
	lastScore = 0,
	lastMouse = { left: 0, top: 0 },
	threePointer = false,
	needInstructions = true,
	LAUNCHPAD_X = 50,
	LAUNCHPAD_Y = context.canvas.height-50,
	LAUNCHPAD_WIDTH = 50,
	LAUNCHPAD_HEIGHT = 12,
	BALL_RADIUS = 8,
	ARENA_LENGTH_IN_METERS = 10,
	//INITIAL_LAUNCH_ANGLE = Math.PI/4,
	INITIAL_LAUNCH_ANGLE = 3.58,
	launchAngle = INITIAL_LAUNCH_ANGLE,
	launchVelocity = 0;
	pixelsPerMeter = canvas.width / ARENA_LENGTH_IN_METERS,
	// Launch pad.....................................................
	launchPadPainter = {
	LAUNCHPAD_FILL_STYLE: 'rgb(100,140,230)',
	paint: function (ledge, context) {
	context.save();
	context.fillStyle = this.LAUNCHPAD_FILL_STYLE;
	context.fillRect(LAUNCHPAD_X, LAUNCHPAD_Y,
	LAUNCHPAD_WIDTH, LAUNCHPAD_HEIGHT);
	context.restore();
	} },
	launchPad = new Sprite('launchPad', launchPadPainter),
// Ball...........................................................
ballPainter = {
	BALL_FILL_STYLE: 'rgb(255,255,0)',
	BALL_STROKE_STYLE: 'rgb(0,0,0,0.4)',
	paint: function (ball, context) {

	context.save();
	context.shadowColor = undefined;
	context.lineWidth = 2;
	context.fillStyle = this.BALL_FILL_STYLE;
	context.strokeStyle = this.BALL_STROKE_STYLE;
	context.beginPath();
	context.arc(ball.left, ball.top,
	ball.radius, 0, Math.PI*2, false);
	context.clip();
	context.fill();
	context.stroke();
	context.restore();
	} 
},
// Lob behavior...................................................
lob = {
	lastTime: 0,
	GRAVITY_FORCE: 9.81, // m/s/s
	hasHit: false,
	applyGravity: function (elapsed) {
		ball.velocityY = (this.GRAVITY_FORCE * elapsed) -
		(launchVelocity * Math.sin(launchAngle));
		//
	},
	updateBallPosition: function (elapsedFrameTime) {
		
		ball.left +=
		ball.velocityX * (elapsedFrameTime) * pixelsPerMeter;
		ball.top +=
		ball.velocityY * (elapsedFrameTime) * pixelsPerMeter;
		//
	},
	checkForThreePointer: function () {
		if (ball.top < 0) {
		threePointer = true;
		}
	},
	checkBallBounds: function () {
		if (ball.top > canvas.height || ball.left > canvas.width) {
			reset();
		}
	},
	checkHasHit : function(){

		if ( ball.left + ball.width > bucket.left && ball.top + ball.height/2 > bucket.top+40 && ball.top < bucket.top+bucket.height-20 )
		{
			this.hasHit = true;
			
			ball.velocityX = - ball.velocityX;
			ball.velocityY = - ball.velocityY;
			ball.left = bucket.left-ball.width;
			
		}
	}, 	
	execute: function (ball, context, time) {
		var updateDelta,
		elapsedFlightTime,
		elaspedFrameTime;
		if (ballInFlight) {
		elapsedFrameTime = (time - this.lastTime)/1000;
		elapsedFlightTime = (time - launchTime)/1000;
		this.applyGravity(elapsedFlightTime);
		this.updateBallPosition(elapsedFrameTime);
		this.checkHasHit();
		this.checkForThreePointer();
		this.checkBallBounds();
		}
		this.lastTime = time;
	}
},

ball = new Sprite('ball', ballPainter, [ lob ]),
ballInFlight = false,
// Bucket.........................................................
catchBall = {
	ballInBucket: function() {
		if ( !lob.hasHit ){
			return ball.left > bucket.left + bucket.width/2 &&
			ball.left < bucket.left + bucket.width &&
			ball.top > bucket.top && ball.top <
			bucket.top + bucket.height/3;
		}
	},
		
	adjustScore: function() {
		if (threePointer) lastScore = 3;
		else lastScore = 2;
		score += lastScore;
		scoreboard.innerHTML = score;
	},
	execute: function (bucket, context, time) {
		if (ballInFlight && this.ballInBucket()) {
		reset();
		this.adjustScore();
		}
	}
},
BUCKET_X = canvas.width - 300,
BUCKET_Y = canvas.height - 200,
bucketImage = new Image(),

bucket = new Sprite('bucket',
	{
	
	paint: function (sprite, context) {
	
	context.drawImage(bucketImage, BUCKET_X, BUCKET_Y);
	} },
	[ catchBall ]
	);
// Functions..........................................................
function windowToCanvas(x, y) {
var bbox = canvas.getBoundingClientRect();
return { x: x - bbox.left * (canvas.width / bbox.width),
y: y - bbox.top * (canvas.height / bbox.height)
};
}
function reset() {
ball.left = LAUNCHPAD_X + LAUNCHPAD_WIDTH/2;
ball.top = LAUNCHPAD_Y - ball.height/2;
ball.velocityX = 0;
ball.velocityY = 0;
ballInFlight = false;
needInstructions = false;
lastScore = 0;
}
function showText(text) {
var metrics;
context.font = '42px Helvetica';
metrics = context.measureText(text);
context.save();
context.shadowColor = undefined;
context.strokeStyle = 'rgb(80,120,210)';
context.fillStyle = 'rgba(100,140,230,0.5)';
context.fillText(text,
canvas.width/2 - metrics.width/2,
canvas.height/2);
context.strokeText(text,
canvas.width/2 - metrics.width/2,
canvas.height/2);
context.restore();
}
function drawGuidewire() {

context.moveTo(ball.left, ball.top);
context.lineTo(lastMouse.left, lastMouse.top);
context.stroke();
};
function updateBackgroundText() {
if (lastScore == 3) showText('Three pointer!');
else if (lastScore == 2) showText('Nice shot!');
else if (needInstructions) showText('Click to launch ball');
};
function resetScoreLater() {
setTimeout(function () {
lastScore = 0;
}, 1000);
};
function updateSprites(time) {

bucket.update(context, time);
launchPad.update(context, time);
ball.update(context, time);
}
function paintSprites() {

launchPad.paint(context);
bucket.paint(context);
ball.paint(context);
}
// Event handlers.....................................................
canvas.onmousedown = function(e) {
	var rect;
	e.preventDefault();

	if ( ! ballInFlight) {

	ball.velocityX = launchVelocity * Math.cos(launchAngle);
	ball.velocityY = launchVelocity * Math.sin(launchAngle);
	ballInFlight = true;
	lob.hasHit = false;
	threePointer = false;
	launchTime = +new Date();
	
	}
};
var trigger =false;

canvas.onmousemove = function (e) {
	var rect;
	e.preventDefault();
	if ( ! ballInFlight) {
		loc = windowToCanvas(e.clientX, e.clientY);
		lastMouse.left = loc.x;
		lastMouse.top = loc.y;
		deltaX = Math.abs(lastMouse.left - ball.left);
		deltaY = Math.abs(lastMouse.top - ball.top);
		launchAngle = 
		Math.atan(parseFloat(deltaY) / parseFloat(deltaX));
		launchVelocity = 
		4 * deltaY / Math.sin (launchAngle) / pixelsPerMeter;
		
		launchVelocityOutput.innerHTML = launchVelocity.toFixed(2);
		launchAngleOutput.innerHTML = (launchAngle * 180/Math.PI).toFixed(2);
		
	}
};
var counter=0;
// Animation loop.....................................................
function animate(time) {
elapsedTime = (time - launchTime) / 1000;
context.clearRect(0, 0, canvas.width, canvas.height);
	if (!ballInFlight) {
		  resetScoreLater();
		  drawGuidewire();
	}
	
	updateSprites(time);
	paintSprites();

window.requestNextAnimationFrame(animate);
counter++;
}
// Initialization.....................................................
ball.width = BALL_RADIUS*2;
ball.height = ball.width;
ball.left = LAUNCHPAD_X + LAUNCHPAD_WIDTH/2;
ball.top = LAUNCHPAD_Y - ball.height/2;
ball.radius = BALL_RADIUS;
context.lineWidth = 0.5;
context.strokeStyle = 'rgba(0,0,0,0.5)';
context.shadowColor = 'rgba(0,0,0,0.5)';
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4; context.
stroke();
bucketImage.src = 'images/bucket_1.png';
bucketImage.onload = function (e) {
bucket.left = BUCKET_X;
bucket.top = BUCKET_Y;
bucket.width = bucketImage.width;
bucket.height = bucketImage.height;
};
paintSprites();
window.requestNextAnimationFrame(animate);
