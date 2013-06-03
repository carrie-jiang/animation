
// Constructor........................................................
var SpriteAnimator = function (painters, elapsedCallback) {
this.painters = painters || []; this.elapsedCallback =
elapsedCallback;
this.duration = 1000;
this.startTime = 0;
this.index = 0;
};
// Prototype..........................................................
SpriteAnimator.prototype = {
end: function (sprite, originalPainter) {
sprite.animating = false;
if (this.elapsedCallback) this.elapsedCallback(sprite);
else sprite.painter = originalPainter;
},
start: function (sprite, duration) {
var endTime = +new Date() + duration,
period = duration / (this.painters.length),
animator = this,
originalPainter = sprite.painter,
lastUpdate = 0;
this.index = 0;
sprite.animating = true;
sprite.painter = this.painters[this.index];
requestNextAnimationFrame( function spriteAnimatorAnimate(time) {
if (time < endTime) {
if ((time - lastUpdate) > period) {
sprite.painter = animator.painters[++animator.index];
lastUpdate = time;
}
requestNextAnimationFrame(spriteAnimatorAnimate);
}
else {
animator.end(sprite, originalPainter);
} });
},
};var canvas = document.getElementById('canvas'),
context = canvas.getContext('2d'),
explosionButton = document.getElementById('explosionButton'),
BOMB_LEFT = 100,
BOMB_TOP = 80,
BOMB_WIDTH = 180,
BOMB_HEIGHT = 130,
NUM_EXPLOSION_PAINTERS = 9,
NUM_FUSE_PAINTERS = 9,
// Painters........................................................
bombPainter = new ImagePainter('bomb.png'),
bombNoFusePainter = new ImagePainter('bomb-no-fuse.png'),
fuseBurningPainters = [],
explosionPainters = [],
// Animators.......................................................
fuseBurningAnimator = new SpriteAnimator(
fuseBurningPainters,
function () { bomb.painter = bombNoFusePainter; });
explosionAnimator = new SpriteAnimator(
explosionPainters,
function () { bomb.painter = bombNoFusePainter; });
// Bomb...........................................................
bomb = new Sprite('bomb', bombPainter),
// Functions..........................................................
function resetBombNoFuse() {
bomb.painter = bombNoFusePainter;
}
// Event handlers.....................................................
explosionButton.onclick = function (e) {
if (bomb.animating) // Not now...
return;
// Burn fuse for 2 seconds
fuseBurningAnimator.start(bomb, 2000);
// Wait for 3 seconds, then explode for 1 second
setTimeout(function () {
explosionAnimator.start(bomb, 1000);
// Wait for 2 seconds, then reset to the original bomb image
setTimeout(function () {
bomb.painter = bombPainter;
}, 2000);
}, 3000);
bomb.width = BOMB_WIDTH;
bomb.height = BOMB_HEIGHT;
for (var i=0; i < NUM_FUSE_PAINTERS; ++i) {
fuseBurningPainters.push(
new ImagePainter('fuse-0' + i + '.png'));
}
for (var i=0; i < NUM_EXPLOSION_PAINTERS; ++i) {
explosionPainters.push(
new ImagePainter('explosion-0' + i + '.png'));
}
window.requestNextAnimationFrame(animate);
};
// Animation..........................................................
function animate(now) {
context.clearRect(0, 0, canvas.width, canvas.height);
bomb.paint(context);
window.requestNextAnimationFrame(animate);
}
// Initialization.....................................................
bomb.left = BOMB_LEFT;
bomb.top = BOMB_TOP;