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

/* James Long: “You need to load all your assets before starting 
the game so that they can be immediately used. If you have several 
images to load, you need to make a bunch of global variables.” */
(function() {
    var resourceCache = {}; // for storing image urls
    var loading = [];
    var readyCallbacks = []; // for storing functions

    /* This loads the url of an image or an array of urls for images 
    needed by the game. In relation to each image, this loader feeds 
    its location to the second loader. */
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            _load(urlOrArr);
        }
    }

    /* This is the second loader. It is called by the first. 
    If this loader finds the url of an image already stored in the 
    resourceCache array, it lets the game access this url instead of 
    re-loading the image. */
    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        /* If the loader doesn't find the url in the cache, it loads 
        the image and adds the new url to the cache.
        Udayan: “The onload function defines a trigger for what to do 
        when an image is done loading. Here, it stores the image as 
        a new value in resourceCache.” Thus, the false value of 
        resourceCache (see below) is changed to true.
        It then calls the isReady function, which checks if ALL the 
        necessary images have finished loading. That in turn invokes 
        each function in an array called readyCallbacks. */
        } else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            /* This sets the value of the cache at false until an image 
            has been loaded. For each new image, the loader associates 
            the source of the image with an url. */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This fetches an image url from the cache. */
    function get(url) {
        return resourceCache[url];
    }

    /* This is triggered when the second image loader must load a new 
    image. It checks the cache to see if all the required images have 
    finished loading. Its default value is true because its for loop 
    will stop running ONLY when ALL necessary images have finished 
    loading. If even one image has not finished loading, this function 
    evaluates to false and continues the loop. */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This adds a function to the readyCallbacks array. That array is 
    invoked when all necessary images have finished loading. In turn, 
    it will invoke the init function in engine.js, which invokes the 
    main function, which makes the game run. */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* Udayan: “This makes several functions in engine.js available 
    globally, by assigning them to a Resources object in the global 
    window object.” 
    I don't really understand what that means, but possibly this 
    allows resources.js and app.js to access the Resources array or 
    resourceCache, which is enclosed within the Engine object in the 
    engine.js file. */
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
