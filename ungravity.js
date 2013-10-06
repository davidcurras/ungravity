//set main namespace
goog.provide('ungravity');

//get requirements
goog.require('goog.object');
goog.require('goog.net.cookies');
goog.require('goog.json');
goog.require('goog.crypt.base64');

goog.require('lime');
goog.require('lime.animation.Delay');
goog.require('lime.animation.Easing');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.ScaleBy');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.ASSETS.ballanim.json');
goog.require('lime.ASSETS.controlpanel.json');
goog.require('lime.ASSETS.staranim.json');
goog.require('lime.audio.Audio');
goog.require('lime.Circle');
goog.require('lime.Director');
goog.require('lime.fill.Frame');
goog.require('lime.fill.Image');
goog.require('lime.Label');
goog.require('lime.Layer');
goog.require('lime.parser.JSON');
goog.require('lime.parser.TMX');
goog.require('lime.RoundedRect');
goog.require('lime.Scene');
goog.require('lime.Sprite');
goog.require('lime.SpriteSheet');
goog.require('lime.transitions.Dissolve');

goog.require('box2d.BodyDef');
goog.require('box2d.CircleShape');
goog.require('box2d.ContactListener');
goog.require('box2d.DebugDraw');
goog.require('box2d.FixtureDef');
goog.require('box2d.PolygonShape');
goog.require('box2d.Vec2');
goog.require('box2d.World');

goog.require('ungravity.ContactListener');
goog.require('ungravity.entities.Entity');
goog.require('ungravity.entities.Ball');
goog.require('ungravity.entities.BadBall');
goog.require('ungravity.entities.Goal');
goog.require('ungravity.entities.GoodBall');
goog.require('ungravity.entities.Player');
goog.require('ungravity.entities.Star');
goog.require('ungravity.entities.Wall');
goog.require('ungravity.entities.World');
goog.require('ungravity.scenes.Credits');
goog.require('ungravity.scenes.Episodes');
goog.require('ungravity.scenes.Info');
goog.require('ungravity.scenes.Levels');
goog.require('ungravity.scenes.Loading');
goog.require('ungravity.scenes.Menu');
goog.require('ungravity.scenes.Options');
goog.require('ungravity.scenes.Play');
goog.require('ungravity.scenes.Presentation');
goog.require('ungravity.scenes.Win');

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
 * If trying to access a level lower than 
 * the first level this id will be returned
 * @type {Number}
 */
ungravity.ZeroLevelId = 0;

/**
 * When the player wins the last level of 
 * the last episode this id will be returned
 * @type {Number}
 */
ungravity.AfterLastLevelId = Infinity;

/**
 * The asset list to download
 * @type {Object}
 */
ungravity.Assets = {
    'Images':{
        'assets/maps/tileset.png': undefined,
        'assets/texts/credits.png': undefined,
        'assets/texts/dcg.png': undefined,
        'assets/texts/options.png': undefined,
        'assets/texts/play.png': undefined,
        'assets/texts/ungravity.png': undefined
        //Thumbnails will be added to this list in Loading Scene
    },
    'Maps':{
        //Maps will be added to this list in Loading Scene
    },
    'SpriteSheets':{
        'assets/sprites/ballanim': undefined,
        'assets/sprites/controlpanel': undefined,
        'assets/sprites/staranim': undefined
    },
    'Sounds':{
        'assets/sounds/ballCollision': undefined,
        'assets/sounds/music': undefined,
        'assets/sounds/star': undefined,
        'assets/sounds/presentation': undefined,
        'assets/sounds/wallBounce': undefined,
        'assets/sounds/win': undefined
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
     * @type {String}
     */
    audioFileExtension: 'mp3',

    /**
     * True if the game is muted
     * @type {Boolean}
     */
    isMuted: false,

    /**
     * The initial volume of the game sounds
     * @type {Number}
     */
    soundsVolume: 0.5,

    /**
     * The initial volume of the game music
     * @type {Number}
     */
    musicVolume: 0.5,

    /**
     * The color for each episode
     * @type {Boolean}
     */
    colors: {'episode1':'brown', 'episode2':'blue', 'episode3':'green', 'episode4':'purple'},

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
    cpWidth: 160,

    /**
     * True if is running from a touch device
     * @type {Boolean}
     */
    isTouch: true,

    /**
     * True if must render in HTML5 canvas
     * @type {Boolean}
     */
    canvasRenderer: true,

    /**
     * The game language ISO code
     * @type {String}
     */
    language: 'en'
};

/**
 * A wrapper for console.log function
 * @param  {String} text The text to log
 * @return {undefined} Nothing returned
 */
ungravity.log = function(text, type){
    if(typeof console !== 'undefined'){
        if(type == 'dir' && (typeof console.dir === 'function')){
            console.dir(text);
        } else if(type == 'err' && (typeof console.err === 'function')){
            console.err(text);
        } else if(type == 'warn' && (typeof console.warn === 'function')){
            console.warn(text);
        } else if(typeof console.log === 'function'){
            console.log(text);
        }
    }
};

/** 
 * The application entry point
 * @return {undefined} Nothing returned
 */
ungravity.start = function(){
    ungravity.director = new lime.Director(document.body, ungravity.settings.width, ungravity.settings.height);
    var canv = goog.net.cookies.get('canv', '1');
    ungravity.settings.canvasRenderer = parseInt(canv) > 0 ? true : false;
    var lang = goog.net.cookies.get('lang', 'en');
    ungravity.settings.language = lang;
    ungravity.Player = new ungravity.entities.Player();
    ungravity.director.makeMobileWebAppCapable();
    ungravity.director.setDisplayFPS(true);
    if (goog.userAgent.GECKO){
        ungravity.settings.audioFileExtension = 'ogg';
    }
    try {  
        document.createEvent("TouchEvent");  
        ungravity.settings.isTouch = true;  
    } catch (e) {  
        ungravity.settings.isTouch = false;  
    }
    ungravity.director.replaceScene(new ungravity.scenes.Loading());
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('ungravity.start', ungravity.start);
