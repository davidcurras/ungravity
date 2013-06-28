goog.provide('ungravity.scenes.Play');

goog.require('lime');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Label');
goog.require('lime.Sprite');
goog.require('lime.SpriteSheet');
goog.require('lime.parser.JSON');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.fill.Frame');
goog.require('lime.ASSETS.controls.json');
goog.require('ungravity.entities.World');

/**
 * Constructor
 * @param  {String} level The current level name
 * @return {ungravity.scenes.Play}
 */
ungravity.scenes.Play = function(level) {
    goog.base(this);
    if(typeof ungravity.World !== 'undefined'){
        ungravity.World.destroy();
        ungravity.World = undefined;
    }
    this.cpLayer = new lime.Layer().setAnchorPoint(0,0).setPosition(641,0).setSize(160, 480);
    this.bgLayer = new lime.Layer().setAnchorPoint(0,0).setPosition(0,0).setSize(640, 480);
    this.objLayer = new lime.Layer().setAnchorPoint(0,0).setPosition(0,0).setSize(640, 480);
    this.appendChild(this.cpLayer);
    this.appendChild(this.bgLayer);
    this.appendChild(this.objLayer);
    ungravity.World = new ungravity.entities.World(level, this);
    this.createControlPanel();
    goog.events.listen(this.bgLayer, ['mousedown', 'touchend'], this.clickHandler);
    ungravity.Player.stars = 0;
    ungravity.Player.levelName = level;
    ungravity.World.startUpdating();
};

goog.inherits(ungravity.scenes.Play, lime.Scene);

goog.object.extend(ungravity.scenes.Play.prototype, {

    /**
     * The layer that contains the control panel
     * @type {lime.Layer}
     */
    cpLayer: undefined,

    /**
     * The layer that contains the background images
     * @type {lime.Layer}
     */
    bgLayer: undefined,

    /**
     * The layer that contains sprites and box2d bodies
     * @type {lime.Layer}
     */
    objLayer: undefined,

    /**
     * The control panel spritesheet
     * @type {lime.SpriteSheet}
     */
    controlSS: undefined,

    /**
     * The sprite that shows the current gravity direction
     * @type {lime.Label}
     */
    gravitySpt: undefined,

    /**
     * The label that shows the current level points
     * @type {lime.Label}
     */
    levelPointsLabel: undefined,

    /**
     * The label that shows the total player points
     * @type {lime.Label}
     */
    totalPointsLabel: undefined,

    /**
     * Creates the control panel
     * @return {undefined} Nothing returned
     */
    createControlPanel: function() {
        this.starsLabel = new lime.Label()
            .setText('Stars: 0 / '+ungravity.settings.starsPerLevel)
            .setPosition(40, 100);
        this.totalPointsLabel = new lime.Label()
            .setText('Total: 0')
            .setPosition(40, 150);
        this.controlSS = ungravity.Assets.SpriteSheets['assets/sprites/controls'];
        this.gravitySpt = new lime.Sprite()
            .setFill(this.controlSS.getFrame('brown-down.png'))
            .setSize(32,32)
            .setPosition(40, 50);
        var pause = new lime.Sprite()
            .setFill(this.controlSS.getFrame('brown-pause.png'))
            .setSize(32,32)
            .setPosition(40, 200);
        var replay = new lime.Sprite()
            .setFill(this.controlSS.getFrame('brown-replay.png'))
            .setSize(32,32)
            .setPosition(40, 250);
        var next = new lime.Sprite()
            .setFill(this.controlSS.getFrame('brown-next.png'))
            .setSize(32,32)
            .setPosition(40, 300);
        var exit = new lime.Sprite()
            .setFill(this.controlSS.getFrame('brown-menu.png'))
            .setSize(64,32)
            .setPosition(40, 350);
        var labels = [
            this.starsLabel,
            this.totalPointsLabel
        ];
        var sprites = [
            this.gravitySpt,
            pause,
            replay,
            next,
            exit
        ];
        for (var i in labels) {
            labels[i].setFontFamily('Verdana')
                .setFontSize(16)
                .setFontColor('#ff0000')
                .setAnchorPoint(0, 0);
            this.cpLayer.appendChild(labels[i]);
        };
        for (var i in sprites) {
            sprites[i].setAnchorPoint(0, 0);
            this.cpLayer.appendChild(sprites[i]);
        };
        goog.events.listen(pause, ['mousedown', 'touchend'], function(){
            ungravity.World.pause();
        });
        goog.events.listen(replay, ['mousedown', 'touchend'], function(){
            ungravity.World.pause();
            ungravity.director.replaceScene(new ungravity.scenes.Play(ungravity.World.getLevelName()), lime.transitions.Dissolve);
        });
        goog.events.listen(next, ['mousedown', 'touchend'], function(){
            ungravity.World.pause();
            ungravity.director.replaceScene(new ungravity.scenes.Play(ungravity.World.getNextLevelName()), lime.transitions.Dissolve);
        });
        goog.events.listen(exit, ['mousedown', 'touchend'], function(){
            ungravity.World.pause();
            ungravity.director.replaceScene(new ungravity.scenes.Levels(ungravity.World.episode.toString()), lime.transitions.Dissolve);
        });
    },

    /**
     * Updates the control panel with the current world and player states
     * @return {undefined} Nothing returned
     */
    updateControlPanel: function() {
        var gravity = ungravity.World.b2dObject.m_gravity;
        if(gravity.y > 0){
            this.gravitySpt.setFill(this.controlSS.getFrame('brown-down.png'));
        } else if(gravity.y < 0){
            this.gravitySpt.setFill(this.controlSS.getFrame('brown-up.png'));
        } else if(gravity.x > 0){
            this.gravitySpt.setFill(this.controlSS.getFrame('brown-right.png'));
        } else {
            this.gravitySpt.setFill(this.controlSS.getFrame('brown-left.png'));
        }
        this.starsLabel.setText('Stars: '+ungravity.Player.stars+' / '+ungravity.settings.starsPerLevel);
        this.totalPointsLabel.setText('Total: '+ungravity.Player.getTotalPoints());
    },

    /**
     * On click changes the gravity
     * @return {undefined} Nothing returned
     */
    clickHandler: function() {
        ungravity.World.changeGravity();
    }
});