/* --------------------------------------------------------------------
Having no programming background at all, I needed the step-by-step 
explanations given in the discussion thread “A Study in JavaScript: 
Provided Code for the Game Clone,” written by Udayan. The post explained 
the two other JS files, but it didn't go beyond the Enemy Class and the 
canvas. To actually start filling out this file, I resorted to copying 
from the work of students who have posted their project repositories on 
GitHub and shared the links in the forum. Many thanks to danielmoi, 
morapost, andrewlw89, jyothisridhar, ayimaster, lacyjpr and joseterrera.
-------------------------------------------------------------------- */

/* =============
    ENEMIES
============= */

// Appearance, starting position, and speed of enemy bugs
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = Math.floor((Math.random() * 400) + 100);
};

// Speed of movement across the screen and behavior at canvas edges
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt; // speed is the same on all computers
    if (this.x > 500) { // whenever a bug reaches the right edge
        this.x = -100; // a new bug appears at the left edge
        this.speed = Math.floor((Math.random() * 400) + 100);
    }
};

// How each enemy bug is drawn on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* The enemy array. The for loop keeps adding bugs to rows 1-3. 
The ones in the top row are centered at -100px on the horizontal 
axis of the canvas and at 60px on the vertical. Each of the others 
start at the same horizontal point 83px below the previous one. */
var allEnemies = [];
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy(-100, 60 + (83 * i)));
}

/* =============
    PLAYER
============= */

// Appearance, position, number of lives, and the user's score
var Player = function(x, y, lives, score) {
    this.sprite = 'images/char-cat-girl.png';
    this.x = x;
    this.y = y;
    this.lives = lives;
    this.score = score;
};

// Behavior on reaching water, colliding with a bug, collecting a star
Player.prototype.update = function() {
      if (this.y <= 50) { // when player reaches the edge of the water
        this.y = 303; // player's position on vertical axis is reset
        this.score += 10; // user's score increases
    }
};

// How the player is drawn on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	
	
    this.drawText(); // score is shown above the canvas (see below)
	this.collision();
   // this function is defined below
   // this.collection(); // this function is defined below
	 
};



// How the user controls the player, using arrow keys
Player.prototype.handleInput = function(key) {
  
   
       var horizontalStep = 101;
    var verticalStep = 83;

    if (key === 'up' && this.y > 50) {
        this.y -= verticalStep;
    } else if (key === 'down' && this.y < 350) {
        this.y += verticalStep;
    } else if (key === 'left' && this.x > 40) {
        this.x -= horizontalStep;
    } else if (key === 'right' && this.x < 400) {
        this.x += horizontalStep;
    }
};

// The player object
var player = new Player(200, 390, 3, 0);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/* ==========
    STAR
========== */

// Appearance and starting position, using the formula below
var Star = function(){
    this.sprite = 'images/Star.png';
   this.x = colWidth * Math.random() * (5);
 this.y = rowHeight * Math.random() * (5 - 1) - 10;
};

/* Formula for starting position and location reset after collision, 
adapted from <https://discussions.udacity.com/t/gem-class-randomly-
reappear-evenly-on-the-grid/15498> */
var colWidth = 101, rowHeight = 83;
/* star.prototype.random = function(low,high) { 

    var range = high - low;
    return Math.floor(Math.random() * range) + low;
}; */

Star.prototype.update = function(low,high) {
	  var range = high - low;
    return Math.floor(Math.random() * range) + low;
    this.collection(); // this function is defined below
};

// How each star is drawn on the screen
Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// The collectible star object
var star = new Star();

/* ================
    COLLISIONS
================ */

/* The only collision method I could get to work were ayimaster's 
<https://github.com/ayimaster/Udacity-FrontEnd-Proj3/blob/master/
js/app.js>. This checks if objects a and b collide. That way, it 
can be used for player collisions with enemies as well as stars.*/
 Player.prototype.collide = function(b) {
    return  this.x < (b.x + 50) &&
           (this.x + 50) > b.x &&
            this.y < (b.y + 50) &&
            (this.y + 50) > b.y;
}; 
/* Player.prototype.collide = function(allEnemie) {
    return this.x < (allEnemie.x + 50) &&
        (this.x + 50) >allEnemie.x &&
        this.y < allEnemie + 50) &&
        (this.y + 50) > allEnemie.y;
};*/
// User score and player lives on collision with an enemy bug
Player.prototype.collision = function(){
//player.collision(allEnemies) 	
    for (var i = 0; i < allEnemies.length; i++) {
        if (this.collide(allEnemies[i])) {
          //  alert('OOPS, YOU RAN INTO A BUG!');
            this.lives -= 1; // player loses a life
            this.y = 303; // player's vertical location is reset
        }
       // if (this.lives < 0) { // when player has lost all extra lives
           // alert('GAME OVER! RELOAD TO REPLAY (CMD-R or CTRL-R).');
           // resetPlayer();//
       // }//
        if (this.score % 15 === 0 && // if score is divisible by 15
            this.lives === 0) { // and player has lost all extra lives
                alert('SCORE IS A MULTIPLE OF 15 - ' +
                'EXTRA LIFE & BONUS POINTS!');
                this.lives += 1; // player gains a bonus life
                this.score += 5; // user gets bonus points
                this.y = 303; // player's vertical location is reset
        }
    }

};

// User score increase whenever the player collides with a star
Player.prototype.collection = function() {
    if (this.collide(star)) {
        this.score += 5;
    }
};

// Star relocation after collection - i.e., collision with player
// TODO: Can I avoid having to rewrite this.x and this.y here?
Star.prototype.collection = function() {
    if (this.collide(player)) {
        this.x = colWidth * random(0,5);
        this.y = rowHeight * random(1,3) - 11;
    }
};

/* =============
    DOCUMENT
============= */

/* Text showing user score, player lives, and simplified instructions; 
adapted from <https://github.com/jyothisridhar/frontend-nanodegree-
arcade-game/blob/master/js/app.js>. I extended the height of the 
canvas by 50px in engine.js. Each text is drawn on a clear-rectangle 
background. The score and life counts are in a different font and 
size than the instructions. */
Player.prototype.drawText = function() {
    ctx.fillStyle = '#333333';
    ctx.font = '30px Boogaloo';
    ctx.clearRect(0, 0, 160, 40);
    ctx.fillText('Score  ' + this.score, 10, 30);
    ctx.clearRect(420, 0, 160, 40);
    ctx.fillText('Lives  ' + this.lives, 420, 30);
    ctx.font = 'bold 12px Arial';
    ctx.clearRect(0, 601, 505, 656);
    ctx.fillText('Use the arrow keys to move your player. ' + 
        'You’ll get 10 points for reaching the water and', 0, 611);
    ctx.fillText('5 points for collecting a star. ' +
        'There’s a chance to get extra lives and points. Good luck!', 0, 631);

};
// Blue background behind the game canvas
document.body.style.backgroundColor = '#1ac6ff';
