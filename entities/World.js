goog.provide('ungravity.entities.World');

/**
 * @constructor
 * @param  {String} levelName The level name episode+level
 * @param  {lime.Scene} scene The Play scene that contains the world
 * @return {ungravity.entities.World}
 */
ungravity.entities.World = function(levelName, scene) {
    if(typeof ungravity.World !== 'undefined'){
        this.reset();
    }
    this.container = scene;
    this.setLevelAndEpisode(levelName);
    this.color = ungravity.settings.colors['episode'+this.episode];
    this.tmx = ungravity.Assets.Maps['assets/maps/map'+levelName+'.tmx'];
    this.gravity = new box2d.Vec2(0.0, 9.81);
    this.b2dObject = new box2d.World(this.gravity, ungravity.settings.allowSleep);
    this.b2dObject.SetWarmStarting(ungravity.settings.warmStarting);
    this.b2dObject.SetContactListener(new ungravity.ContactListener());
    this.addControlPanelSprites();
    this.createBackground();
    this.createObjects();
};

goog.object.extend(ungravity.entities.World.prototype, {

    /**
     * The box2d world
     * @type {box2d.World}
     */
    b2dObject: undefined,

    /**
     * The level number
     * @type {Number}
     */
    level: 1,

    /**
     * The episode number
     * @type {Number}
     */
    episode: 1,

    /**
     * The Tiled file with the current world design
     * @type {lime.parser.TMX}
     */
    tmx: undefined,

    /**
     * The box2d World gravity
     * @type {box2d.Vec2}
     */
    gravity: undefined,

    /**
     * The Play scene that contains the world
     * @type {lime.Scene}
     */
    container: undefined,

    /**
     * True if the game is paused
     * @type {Boolean}
     */
    isPaused: false,

    /**
     * The world color
     * @type {String}
     */
    color: 'brown',

    /**
     * The world good balls info
     * @type {Object}
     */
    goodballs: {'total':0,'collected':0},

    /**
     * The hash of all objects in the world
     * @type {Object}
     */
    objects: {},

    /**
     * The hash dinamic objects to be updated with box2d.World.Step
     * @type {Object}
     */
    dinamicObjects: {},

    /**
     * The list of objects to be destroyed when the current step ends
     * @type {Array}
     */
    dieList: [],

    /**
     * A custom function to run after the current update finishes
     * @type {Function}
     */
    afterUpdate: undefined,

    /**
     * The function to excecute after the pause warning is accepted
     * @type {Function}
     */
    afterPause: undefined,

    /**
     * Sets the level and episode from the level name
     * @param  {String} levelName The level name episode+level
     * @return {undefined} Nothing returned
     */
    setLevelAndEpisode: function(levelName) {
        if(typeof levelName == 'string' && levelName.length == 3){
            this.level = isNaN(parseInt(levelName.substring(1))) ? 1 : parseInt(levelName.substring(1));
            this.episode = isNaN(parseInt(levelName.substring(0,1))) ? 1 : parseInt(levelName.substring(0,1));
        } else {
            this.level = 1;
            this.episode = 1;
        }
    },

    /**
     * Gets the level name from the current level and episode
     * @return {String} The level name episode+level
     */
    getLevelName: function() {
        levelName = ''+this.episode;
        if(this.level < 10){
            levelName += '0';
        }
        return levelName + this.level;
    },

    /**
     * Calculates the next level name. If this is the last level will return ungravity.AfterLastLevelId
     * @return {String | Number} The next level name episode+level
     * @todo The last level of the last episode must lead to the game winner congratulations
     */
    getNextLevelName: function() {
        var levelName = '';
        var newLevel = this.level + 1;
        var newEpisode = this.episode;
        if(newLevel > ungravity.settings.levelsPerEpisode){
            newLevel = 1;
            ++newEpisode;
        }
        if(newEpisode > ungravity.settings.episodes){
            return ungravity.AfterLastLevelId;
        }
        if(newLevel < 10){
            levelName += newEpisode+'0'+newLevel;
        } else {
            levelName += newEpisode+newLevel;
        }
        return levelName;
    },

    /**
     * Calculates the previous level name. If this is the first level will return ungravity.ZeroLevelId
     * @return {String | Number} The previous level name episode+level
     */
    getPrevLevelName: function() {
        var levelName = '';
        var newLevel = this.level - 1;
        var newEpisode = this.episode;
        if(newLevel < 1){
            if(newEpisode > 1){
                newLevel = ungravity.settings.levelsPerEpisode;
                --newEpisode;
            } else {
                return ungravity.ZeroLevelId;
            }
        }
        if(newLevel < 10){
            levelName += newEpisode+'0'+newLevel;
        } else {
            levelName += newEpisode+newLevel;
        }
        return levelName;
    },

    /**
     * Adds the sprites for the control panel layer based on the tmx map info
     * @return {undefined} Nothing returned
     */
    addControlPanelSprites: function() {
        var mapDisplacement = 16;
        var playableTiles = 20;
        for(var i = 0; i < this.tmx.layers.length; i++){
            var layer = this.tmx.layers[i];
            var cpDisplacement = playableTiles*this.tmx.tilewidth-mapDisplacement;
            if(layer.name == 'controlpanel'){
                for(var j = 0; j < layer.tiles.length; j++){
                    //if((j%layer.width) >= playableTiles){
                        var tile = layer.tiles[j];
                        var px = tile.px - cpDisplacement;
                        var py = tile.py + mapDisplacement;
                        var sprite = new lime.Sprite().setPosition(px, py).setFill(tile.tile.frame);
                        this.container.cpLayer.appendChild(sprite);
                    //}
                }
            } 
        }
    },

    /**
     * Adds the background layer to the world based on the tmx map info
     * @return {undefined} Nothing returned
     */
    createBackground: function() {
        var mapDisplacement = 16;
        for(var i = 0; i < this.tmx.layers.length; i++){
            var layer = this.tmx.layers[i];
            if(layer.name == 'background'){
                for(var j = 0; j < layer.tiles.length; j++){
                    var tile = layer.tiles[j];
                    var px = tile.px + mapDisplacement;
                    var py = tile.py + mapDisplacement;
                    var sprite = new lime.Sprite().setPosition(px, py).setFill(tile.tile.frame);
                    this.container.bgLayer.appendChild(sprite);
                }
            } 
        }
    },

    /**
     * Adds the objects layer to the world based on the tmx map info
     * @return {undefined} Nothing returned
     */
    createObjects: function() {
        for(var i = 0; i < this.tmx.objects.length; i++){
            var tmxObj = this.tmx.objects[i];
            if(tmxObj.name != undefined && tmxObj.properties.objClass != undefined){
                this.makeObject(tmxObj);
            }
        }
    },

    /**
     * Creates an object of the proper class
     * @param  {Object} tmxObj [description]
     * @return {undefined} Nothing returned
     */
    makeObject: function(tmxObj) {
        switch(tmxObj.properties.objClass){
            case 'wall':
                this.objects[tmxObj.name] = new ungravity.entities.Wall(tmxObj, this);
                break;
            case 'goal':
                this.objects[tmxObj.name] = new ungravity.entities.Goal(tmxObj, this);
                break;
            case 'star':
                this.objects[tmxObj.name] = new ungravity.entities.Star(tmxObj, this);
                break;
            case 'goodball':
                ++this.goodballs.total;
                this.dinamicObjects[tmxObj.name] = this.objects[tmxObj.name] = new ungravity.entities.GoodBall(tmxObj, this, this.color);
                break;
            case 'badball':
                this.dinamicObjects[tmxObj.name] = this.objects[tmxObj.name] = new ungravity.entities.BadBall(tmxObj, this);
                break;
            case 'blackball':
            default:
                ungravity.log('No object');
        }
    },

    /**
     * Changes the gravity randomly
     * @return {undefined} Nothing returned
     */
    changeGravity: function() {
        var random = Math.random();
        if(random < 0.33){
            if(this.b2dObject.m_gravity.x == 0){
                this.b2dObject.m_gravity.y = -1 * this.b2dObject.m_gravity.y;
            } else {
                this.b2dObject.m_gravity.x = -1 * this.b2dObject.m_gravity.x;
                this.b2dObject.m_gravity.y = 0;
            }
        } else if(random < 0.66){
            if(this.b2dObject.m_gravity.x == 0){
                this.b2dObject.m_gravity.x = -1 * this.b2dObject.m_gravity.y;
                this.b2dObject.m_gravity.y = 0;
            } else {
                this.b2dObject.m_gravity.y = -1 * this.b2dObject.m_gravity.x;
                this.b2dObject.m_gravity.x = 0;
            }
        } else {
            if(this.b2dObject.m_gravity.x == 0){
                this.b2dObject.m_gravity.x = this.b2dObject.m_gravity.y;
                this.b2dObject.m_gravity.y = 0;
            } else {
                this.b2dObject.m_gravity.y = this.b2dObject.m_gravity.x;
                this.b2dObject.m_gravity.x = 0;
            }
        }
        for(var key in this.dinamicObjects){
            this.dinamicObjects[key].b2dObject.SetAwake(true);
        }
    },

    /**
     * Starts the update loop
     * @return {undefined} Nothing returned
     */
    startUpdating: function(){
        lime.scheduleManager.schedule(this.update, this);
    },

    /**
     * Updates all objects in the world
     * @param  {Number} dt      The time elapsed since the last update (in milliseconds)
     * @return {undefined} Nothing returned
     */
    update: function(dt) {
        if(dt>100){
            dt=100; // long delays(after pause) cause false collisions
        }
        var timeStep = dt/1000;
        var velocityLoops = parseInt(300 * timeStep); //velocity Iterations Per Second
        var positionLoops = parseInt(200 * timeStep); //position Iterations Per Second
        try {
            this.b2dObject.ClearForces();
            this.b2dObject.Step(timeStep, velocityLoops, positionLoops);
            this.emptyDieList();
            this.render();
            if(typeof this.afterUpdate !== 'undefined'){
               this.afterUpdate(); 
            }
        } catch (e) {
            ungravity.log('entities.World at line 337:\t\t'+e.message, 'err');
            throw e;
        }
    },

    /**
     * Destroyes all bodies in the dieList
     * @return {undefined} Nothing returned
     */
    emptyDieList: function() {
        for (var i = this.dieList.length-1; i >= 0; i--) {
            var objKey = this.dieList[i];
            if(typeof this.objects[objKey] !== 'undefined'){
                this.b2dObject.DestroyBody(this.objects[objKey].b2dObject);
                delete this.objects[objKey];
            }
            this.dieList.pop();
        }
    },

    /**
     * Pauses the world
     * @param {String} modalType The modal type to open when pause
     * @return {undefined} Nothing returned
     */
    pause: function(modalType) {
        if(!this.isPaused){
            this.isPaused = true;
            if(!ungravity.settings.isMuted && (typeof ungravity.Assets.Sounds['assets/sounds/music'] !== 'undefined')){
                ungravity.Assets.Sounds['assets/sounds/music'].stop();
            }
            lime.scheduleManager.unschedule(this.update, this);
            switch(modalType){
                case ungravity.scenes.Play.ModalTypes.Start:
                    this.container.openStartModal();
                    break;
                case ungravity.scenes.Play.ModalTypes.Pause:
                    this.container.openPauseModal();
                    break;
                case ungravity.scenes.Play.ModalTypes.Abort:
                    this.container.openAbortModal();
                    break;
                case ungravity.scenes.Play.ModalTypes.Win:
                    this.container.openWinModal();
                    break;
            }
        }
    },

    /**
     * Resumes the world step
     * @return {undefined} Nothing returned
     */
    resume: function() {
        if(this.isPaused){
            this.isPaused = false;
            this.container.closeInfoModal();
            if(!ungravity.settings.isMuted && (typeof ungravity.Assets.Sounds['assets/sounds/music'] !== 'undefined')){
                ungravity.Assets.Sounds['assets/sounds/music'].play(1000);
            }
            lime.scheduleManager.schedule(this.update, this);
        }
    },

    /**
     * Removes all Box2d bodies and reset variables
     * @return {undefined} Nothing returned
     */
    reset: function() {
        lime.scheduleManager.unschedule(this.update, this);
        if(typeof this.b2dObject !== 'undefined'){
            var b2dBody = this.b2dObject.GetBodyList();
            while(b2dBody){
                var next = b2dBody.m_next;
                this.b2dObject.DestroyBody(b2dBody);
                b2dBody = next;
            }
            this.b2dObject = undefined;
        }
        this.level = 1;
        this.episode = 1;
        this.tmx = undefined;
        this.gravity = undefined;
        this.container = undefined;
        this.isPaused = false;
        this.color = 'brown';
        this.goodballs.total = 0;
        this.goodballs.collected = 0;
        for(var key in this.objects){
            delete this.objects[key];
        }
        for(var key in this.dinamicObjects){
            delete this.dinamicObjects[key];
        }
        this.emptyDieList();
        this.afterUpdate = undefined;
        this.afterAbort = undefined;
    },

    /**
     * Renders the current world state
     * @return {undefined} Nothing returned
     */
    render: function() {
        for(var key in this.dinamicObjects){
            this.dinamicObjects[key].render();
        }
        this.container.updateControlPanel();
    }
});