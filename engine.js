/* --------------------------------------------------------------------
I have rewritten the default comments in this file to make sure I 
understand this project. The kind of step-by-step explanation I needed 
was partly given in the forum post “A Study in JavaScript: Provided 
Code for the Game Clone,” written by Udayan. It helped me understand 
the purpose of this file. Also useful for its detailed explanation was 
James Long's article “Making Sprite-Based Games with Canvas,” from 
<http://jlongster.com/Making-Sprite-based-Games-with-Canvas>. 
This was linked in the forum post “Project 3 Resource List.”
-------------------------------------------------------------------- */

/* Udayan: This is an Immediately Invoked Function Expression (IFFE, 
pronounced “iffy”). It encloses all the code that runs the game, 
to prevent them from polluting the global scope. 
(I don't understand what that means, except maybe this prevents 
the script for this game from conflicting with any other script 
running on the same web page.) */
var Engine = (function(global) {
    /* I still don't understand the explanation for the global 
    parameter and the window object.
    The HTML canvas element allows graphics to be created on web pages. 
    It is only a container. The context element of the canvas provides 
    the actual drawing surface. 
    The lastTime variable refers to the last time that the scene in 
    the game was rendered. */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    /* This sets the canvas' width and height, and adds the canvas 
    inside the body tags when the index file loads in the browser. */
    canvas.width = 505;
    canvas.height = 656;
    doc.body.appendChild(canvas);

    /* This is how the game runs. The scene is continuously 
    updated and rendered, creating the illusion of animation. */
    function main() {
        /* James Long: “Your game will run wildly different on various 
        computers and platforms, so you need to update the scene 
        independently of frame rate. This is achieved by calculating 
        the time since last update (in seconds) and expressing all 
        movements in pixels per second. Movement then becomes 
        x += 50 * dt, or 50 pixels per second.” */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* These invoke the update and render functions. */
        update(dt);
        render();

        /* The lastTime variable was used to calculate the time since 
        the last update of the scene. Here, it is reset to now, 
        preparing it for the next update. */
        lastTime = now;

        /* This uses the browser's requestAnimationFrame function 
        to call main function again. Thus, an infinite loop is created 
        that keeps the game running until the user stops it. */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }
	

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        star.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* This draws the surface of the canvas where all images 
                will be placed. It gives instructions for what to draw 
                (the Image object), where to start drawing on the x-axis, 
                and where to start drawing on the y-axis. The images are 
                taken from the Resources array and used over and over 
                throughout the game. */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
        star.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* This loads all the images needed for each game level. Then it 
    adds the init function on a to-do list, to be executed when all 
    required images have finished loading. */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-cat-girl.png',
        'images/Star.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx; // window.ctx = ctx
})(this);
