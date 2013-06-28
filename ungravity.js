//set main namespace
goog.provide('ungravity');

//get requirements
goog.require('lime');
goog.require('lime.Director');
goog.require('ungravity.entities.Player');
goog.require('ungravity.scenes.Loading');

/**
 * The world object
 * @type {ungravity.entities.World}
 */
ungravity.World = undefined;

/**
 * The game player
 * @type {ungravity.entities.Player}
 */
ungravity.Player = undefined;

/**
 * The asset list to download
 * @type {Object}
 */
ungravity.Assets = {
    'Images':{
        'assets/maps/tileset.png': null,
        'assets/sprites/goal.png': null,
        'assets/texts/credits.png': null,
        'assets/texts/dcg.png': null,
        'assets/texts/options.png': null,
        'assets/texts/play.png': null,
        'assets/texts/ungravity.png': null
        //Thumbnails will be added to this list in Loading Scene
    },
    'Maps':{
        //Maps will be added to this list in Loading Scene
    },
    'SpriteSheets':{
        'assets/sprites/ball': null,
        'assets/sprites/controls': null,
        'assets/sprites/star': null
    },
    'Sounds':{
        'assets/sounds/bounce': null,
        'assets/sounds/star': null,
        'assets/sounds/start': null,
        'assets/sounds/win': null
    },
    'Total':0,
    'Loaded':0
};

/**
 * Initial game setting
 * @type {Object}
 */
ungravity.settings = {

    /**
     * The audio file extension depends on the browser
     * @type {Number}
     */
    audioFileExtension: 'mp3',

    /**
     * True if the dinamic bodies in the box2d World must sleep when are in rest
     * @type {Boolean}
     */
    allowSleep: true,

    /**
     * True if box2d debug draw must be running
     * @type {Boolean}
     */
    b2dDraw: true,

    /**
     * True if has to invert the box2d y positions to match limejs rendering
     * @type {Boolean}
     */
    b2dDrawInvert: false,

    /**
     * The ratio between box2d and limejs values
     * @type {Number}
     */
    b2dMultiplier: 10,

    /**
     * True if the physics calculations must be accurate (expensive)
     * @type {Boolean}
     */
    warmStarting: false,

    /**
     * The amount of levels per episode
     * @type {Number}
     */
    levelsPerEpisode: 9,

    /**
     * The amount of episodes
     * @type {Number}
     */
    episodes: 2,

    /**
     * The amount of stars per level
     * @type {Number}
     */
    starsPerLevel: 30,

    /**
     * The game width
     * @type {Number}
     */
    width: 800,

    /**
     * The game height
     * @type {Number}
     */
    height: 480,

    /**
     * The control panel width
     * @type {Number}
     */
    cpWidth: 160
};

/**
 * A wrapper for console.log function
 * @param  {String} text The text to log
 * @return {undefined} Nothing returned
 */
ungravity.log = function(text){
    if((typeof console !== 'undefined') && (typeof console.log === 'function')){
        console.log(text);
    }
};

/** 
 * The application entry point
 * @return {undefined} Nothing returned
 */
ungravity.start = function(){
    ungravity.director = new lime.Director(document.body, ungravity.settings.width, ungravity.settings.height);
    ungravity.Player = new ungravity.entities.Player();
    ungravity.director.makeMobileWebAppCapable();
    ungravity.director.setDisplayFPS(true);
    if (goog.userAgent.GECKO){
        ungravity.settings.audioFileExtension = 'ogg';
    }
    ungravity.director.replaceScene(new ungravity.scenes.Loading());
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('ungravity.start', ungravity.start);
