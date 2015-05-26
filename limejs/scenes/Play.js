goog.provide('ungravity.scenes.Play');
goog.require('lime.Scene');

/**
 * @constructor
 * @extends {lime.Scene}
 * @param  {String} level The current level name
 * @return {ungravity.scenes.Play}
 */
ungravity.scenes.Play = function(level) {
    goog.base(this);
    if(ungravity.settings.canvasRenderer){
       this.setRenderer(lime.Renderer.CANVAS) 
    }
    this.cpLayer = new lime.Layer().setAnchorPoint(0,0).setPosition(641,0).setSize(160, 480);
    this.bgLayer = new lime.Layer().setAnchorPoint(0,0).setPosition(0,0).setSize(640, 480);
    this.objLayer = new lime.Layer().setAnchorPoint(0,0).setPosition(0,0).setSize(640, 480);
    var bgSprite = new lime.Sprite().setAnchorPoint(0,0).setPosition(0,0).setSize(640-32, 480).setFill(0,0,0);
    this.bgLayer.appendChild(bgSprite); //for make the bgLayer clickeable
    this.appendChild(this.cpLayer);
    this.appendChild(this.bgLayer);
    this.appendChild(this.objLayer);
    ungravity.World = new ungravity.entities.World(level, this);
    this.setSpritesFills();
    this.createControlPanel();
    goog.events.listen(this.bgLayer, ['mousedown', 'touchend'], this.clickHandler);
    ungravity.Player.stars = 0;
    ungravity.Player.levelName = level;
    ungravity.World.startUpdating();
    ungravity.World.pause(ungravity.scenes.Play.ModalTypes.Start);
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
     * The layer that contains info. Pauses the world before be shown.
     * @type {lime.Layer}
     */
    infoLayer: undefined,

    /**
     * Adds initial fill values to the control panel and modal dialog sprites
     * @return {undefined} Nothing returned
     */
    setSpritesFills: function() {
        var controlSS = ungravity.Assets.SpriteSheets['assets/sprites/controlpanel'];
        var Spt = ungravity.scenes.Play.SpritesAndLabels.Sprites;
        Spt.CtrlPanel.Gravity.setFill(controlSS.getFrame('down-'+ungravity.World.color+'.png'));
        Spt.CtrlPanel.LevelBalls.setFill(controlSS.getFrame('ball-'+ungravity.World.color+'.png'));
        Spt.CtrlPanel.Prev.setFill(controlSS.getFrame('prev-'+ungravity.World.color+'.png'));
        Spt.CtrlPanel.Replay.setFill(controlSS.getFrame('replay-'+ungravity.World.color+'.png'));
        Spt.CtrlPanel.Next.setFill(controlSS.getFrame('next-'+ungravity.World.color+'.png'));
        Spt.CtrlPanel.Pause.setFill(controlSS.getFrame('pause-'+ungravity.World.color+'.png'));
        Spt.CtrlPanel.Mute.setFill(controlSS.getFrame('mute-'+ungravity.World.color+'.png'));
        Spt.CtrlPanel.Menu.setFill(controlSS.getFrame('menu-'+ungravity.World.color+'.png'));
        Spt.Modal.LevelBalls.setFill(controlSS.getFrame('ball-'+ungravity.World.color+'.png'));
        Spt.Modal.Prev.setFill(controlSS.getFrame('prev-'+ungravity.World.color+'.png'));
        Spt.Modal.Next.setFill(controlSS.getFrame('next-'+ungravity.World.color+'.png'));
        Spt.Modal.Mute.setFill(controlSS.getFrame('mute-'+ungravity.World.color+'.png'));
    },

    /**
     * Creates the control panel
     * @return {undefined} Nothing returned
     */
    createControlPanel: function() {
        var controlSS = ungravity.Assets.SpriteSheets['assets/sprites/controlpanel'];
        var Lbl = ungravity.scenes.Play.SpritesAndLabels.Labels.CtrlPanel;
        var Spt = ungravity.scenes.Play.SpritesAndLabels.Sprites.CtrlPanel;
        Lbl.LevelStars.setText('0/'+ungravity.settings.starsPerLevel);
        Lbl.LevelBalls.setText('0/'+ungravity.World.goodballs.total);
        for (var key in Lbl) {
            this.cpLayer.appendChild(Lbl[key]);
        }
        Spt.Gravity.setFill(controlSS.getFrame('down-'+ungravity.World.color+'.png'));
        var prevLevelName = ungravity.World.getPrevLevelName();
        if((prevLevelName !== ungravity.ZeroLevelId) && (typeof ungravity.Player.levelStars[prevLevelName] !== 'undefined')){
            Spt.Prev.setFill(controlSS.getFrame('prev-'+ungravity.World.color+'.png'));
        } else {
            Spt.Prev.setFill(controlSS.getFrame('prev-'+ungravity.World.color+'-active.png'));
        }
        Spt.Replay.setFill(controlSS.getFrame('replay-'+ungravity.World.color+'.png'));
        var nextLevelName = ungravity.World.getNextLevelName();
        if((nextLevelName !== ungravity.AfterLastLevelId) && (typeof ungravity.Player.levelStars[nextLevelName] !== 'undefined')){
            Spt.Next.setFill(controlSS.getFrame('next-'+ungravity.World.color+'.png'));
        } else {
            Spt.Next.setFill(controlSS.getFrame('next-'+ungravity.World.color+'-active.png'));
        }
        Spt.Pause.setFill(controlSS.getFrame('pause-'+ungravity.World.color+'.png'));
        if(ungravity.settings.isMuted){
            Spt.Mute.setFill(controlSS.getFrame('unmute-'+ungravity.World.color+'.png'));
        } else {
            Spt.Mute.setFill(controlSS.getFrame('mute-'+ungravity.World.color+'.png'));
        }
        Spt.Menu.setFill(controlSS.getFrame('menu-'+ungravity.World.color+'.png'));
        for (var key in Spt) {
            goog.events.removeAll(Spt[key]);
            this.cpLayer.appendChild(Spt[key]);
        }
        this.listenControlPanel();
    },

    /**
     * Sets the control panel buttons listeners
     * @return {undefined} Nothing returned
     */
    listenControlPanel: function () {
        var controlSS = ungravity.Assets.SpriteSheets['assets/sprites/controlpanel'];
        var Spt = ungravity.scenes.Play.SpritesAndLabels.Sprites.CtrlPanel;
        goog.events.listen(Spt.Pause, ['mousedown', 'touchend'], function(){
            ungravity.World.pause(ungravity.scenes.Play.ModalTypes.Pause);
        });
        var prevLevelName = ungravity.World.getPrevLevelName();
        if((prevLevelName !== ungravity.ZeroLevelId) && (typeof ungravity.Player.levelStars[prevLevelName] !== 'undefined')){
            goog.events.listen(Spt.Prev, ['mousedown', 'touchend'], function(){
                ungravity.World.pause(ungravity.scenes.Play.ModalTypes.Abort);
                ungravity.World.afterPause = function(){
                    ungravity.director.replaceScene(new ungravity.scenes.Play(prevLevelName), lime.transitions.Dissolve);
                };
            });
        }
        goog.events.listen(Spt.Replay, ['mousedown', 'touchend'], function(){
            ungravity.World.pause(ungravity.scenes.Play.ModalTypes.Abort);
            ungravity.World.afterPause = function(){
                ungravity.director.replaceScene(new ungravity.scenes.Play(ungravity.World.getLevelName()), lime.transitions.Dissolve);
            };
        });
        var nextLevelName = ungravity.World.getNextLevelName();
        if((nextLevelName !== ungravity.AfterLastLevelId) && (typeof ungravity.Player.levelStars[nextLevelName] !== 'undefined')){
            goog.events.listen(Spt.Next, ['mousedown', 'touchend'], function(){
                ungravity.World.pause(ungravity.scenes.Play.ModalTypes.Abort);
                ungravity.World.afterPause = function(){
                    ungravity.director.replaceScene(new ungravity.scenes.Play(nextLevelName), lime.transitions.Dissolve);
                };
            });
        }
        goog.events.listen(Spt.Mute, ['mousedown', 'touchend'], function(){
            if(ungravity.settings.isMuted){
                lime.audio.setMute(false);
                ungravity.settings.isMuted = false;
                if(!ungravity.settings.isMuted && (typeof ungravity.Assets.Sounds['assets/sounds/music'] !== 'undefined')){
                    ungravity.Assets.Sounds['assets/sounds/music'].play(1000);
                }
                Spt.Mute.setFill(controlSS.getFrame('mute-'+ungravity.World.color+'.png'));
            } else {
                lime.audio.setMute(true);
                ungravity.settings.isMuted = true;
                Spt.Mute.setFill(controlSS.getFrame('unmute-'+ungravity.World.color+'.png'));
            }
        });
        goog.events.listen(Spt.Menu, ['mousedown', 'touchend'], function(){
            ungravity.World.afterPause = function(){
                ungravity.director.replaceScene(new ungravity.scenes.Levels(ungravity.World.episode.toString()), lime.transitions.Dissolve);
            };
            ungravity.World.pause(ungravity.scenes.Play.ModalTypes.Abort);
        });
    },

    /**
     * Updates the control panel with the current world and player states
     * @return {undefined} Nothing returned
     */
    updateControlPanel: function() {
        var controlSS = ungravity.Assets.SpriteSheets['assets/sprites/controlpanel'];
        var Lbl = ungravity.scenes.Play.SpritesAndLabels.Labels.CtrlPanel;
        var Spt = ungravity.scenes.Play.SpritesAndLabels.Sprites.CtrlPanel;
        var gravity = ungravity.World.b2dObject.m_gravity;
        if(gravity.y > 0){
            Spt.Gravity.setFill(controlSS.getFrame('down-'+ungravity.World.color+'.png'));
        } else if(gravity.y < 0){
            Spt.Gravity.setFill(controlSS.getFrame('up-'+ungravity.World.color+'.png'));
        } else if(gravity.x > 0){
            Spt.Gravity.setFill(controlSS.getFrame('right-'+ungravity.World.color+'.png'));
        } else {
            Spt.Gravity.setFill(controlSS.getFrame('left-'+ungravity.World.color+'.png'));
        }
        Lbl.LevelStars.setText(''+ungravity.Player.stars+' / '+ungravity.settings.starsPerLevel);
        Lbl.LevelBalls.setText(''+ungravity.World.goodballs.collected+'/'+ungravity.World.goodballs.total);
        Lbl.PlayerScore.setText('Score: '+ungravity.Player.getTotalPoints());
    },

    /**
     * Creates and open a level start modal dialog with the world info
     * @return {undefined} Nothing returned
     */
    openStartModal: function() {
        this.infoLayer = new lime.Layer()
            .setAnchorPoint(0,0)
            .setPosition(0,0)
            .setSize(800, 480);
        this.infoLayer.setAnchorPoint(0.5, 0.5);
        this.infoLayer.setPosition(ungravity.settings.width/2, ungravity.settings.height/2);
        var Lbl = ungravity.scenes.Play.SpritesAndLabels.Labels.Modal;
        var Spt = ungravity.scenes.Play.SpritesAndLabels.Sprites.Modal;
        Lbl.Title.setText('Episode: '+ungravity.World.episode+' - Level: '+ungravity.World.level);
        var txt = ungravity.settings.isTouch ? 'TAP' : 'CLICK';
        Lbl.MainText.setText(txt+' the screen to change the gravity RANDOMLY');
        this.infoLayer.appendChild(Spt.Background);
        this.infoLayer.appendChild(Lbl.Title);
        this.infoLayer.appendChild(Lbl.MainText);
        this.infoLayer.appendChild(Spt.Close);
        this.infoLayer.appendChild(Lbl.Start);
        this.infoLayer.appendChild(Lbl.Menu);
        goog.events.listen(this.infoLayer, ['mousedown', 'touchend'], function(e){
            e.event.stopPropagation();
        });
        goog.events.listen(Lbl.Start, ['mousedown', 'touchend'], function(e){
            e.event.stopPropagation();
            ungravity.World.resume();
        });
        goog.events.listen(Lbl.Menu, ['mousedown', 'touchend'], function(){
            ungravity.director.replaceScene(new ungravity.scenes.Levels(ungravity.World.episode), lime.transitions.Dissolve);
        });
        goog.events.listen(Spt.Close, ['mousedown', 'touchend'], function(e){
            e.event.stopPropagation();
            ungravity.World.resume();
        });
        this.appendChild(this.infoLayer);
    },

    /**
     * Creates and open a single pause modal dialog with the world info
     * @return {undefined} Nothing returned
     */
    openPauseModal: function() {
        this.infoLayer = new lime.Layer()
            .setAnchorPoint(0,0)
            .setPosition(0,0)
            .setSize(800, 480);
        this.infoLayer.setAnchorPoint(0.5, 0.5);
        this.infoLayer.setPosition(ungravity.settings.width/2, ungravity.settings.height/2);
        var Lbl = ungravity.scenes.Play.SpritesAndLabels.Labels.Modal;
        var Spt = ungravity.scenes.Play.SpritesAndLabels.Sprites.Modal;
        Lbl.LevelStars.setText(''+ungravity.Player.stars+' / '+ungravity.settings.starsPerLevel);
        Lbl.LevelBalls.setText(''+ungravity.World.goodballs.collected+'/'+ungravity.World.goodballs.total);
        Lbl.PlayerScore.setText('Score: '+ungravity.Player.getTotalPoints());
        Lbl.Title.setText('Game Paused');
        this.infoLayer.appendChild(Spt.Background);
        this.infoLayer.appendChild(Spt.Close);
        this.infoLayer.appendChild(Lbl.Title);
        this.infoLayer.appendChild(Spt.LevelStars);
        this.infoLayer.appendChild(Lbl.LevelStars);
        this.infoLayer.appendChild(Spt.LevelBalls);
        this.infoLayer.appendChild(Lbl.LevelBalls);
        this.infoLayer.appendChild(Lbl.PlayerScore);
        this.infoLayer.appendChild(Lbl.Menu);
        this.infoLayer.appendChild(Lbl.Close);
        goog.events.listen(this.infoLayer, ['mousedown', 'touchend'], function(e){
            e.event.stopPropagation()
        });
        goog.events.listen(Lbl.Menu, ['mousedown', 'touchend'], function(){
            ungravity.director.replaceScene(new ungravity.scenes.Levels(ungravity.World.episode), lime.transitions.Dissolve);
        });
        goog.events.listen(Lbl.Close, ['mousedown', 'touchend'], function(e){
            e.event.stopPropagation();
            ungravity.World.resume();
        });
        goog.events.listen(Spt.Close, ['mousedown', 'touchend'], function(e){
            e.event.stopPropagation();
            ungravity.World.resume();
        });
        this.appendChild(this.infoLayer);
    },

    /**
     * Creates and open a modal dialog to confirm or cancel aborting the current level
     * @return {undefined} Nothing returned
     */
    openAbortModal: function() {
        this.infoLayer = new lime.Layer()
            .setAnchorPoint(0,0)
            .setPosition(0,0)
            .setSize(800, 480);
        this.infoLayer.setAnchorPoint(0.5, 0.5);
        this.infoLayer.setPosition(ungravity.settings.width/2, ungravity.settings.height/2);
        var Lbl = ungravity.scenes.Play.SpritesAndLabels.Labels.Modal;
        var Spt = ungravity.scenes.Play.SpritesAndLabels.Sprites.Modal;
        Lbl.LevelStars.setText(''+ungravity.Player.stars+' / '+ungravity.settings.starsPerLevel);
        Lbl.LevelBalls.setText(''+ungravity.World.goodballs.collected+'/'+ungravity.World.goodballs.total);
        Lbl.PlayerScore.setText('Score: '+ungravity.Player.getTotalPoints());
        Lbl.Title.setText('Warning');
        Lbl.MainText.setText('You will lose the progress of the current level');
        this.infoLayer.appendChild(Spt.Background);
        this.infoLayer.appendChild(Spt.Close);
        this.infoLayer.appendChild(Lbl.Title);
        this.infoLayer.appendChild(Lbl.MainText);
        this.infoLayer.appendChild(Spt.LevelStars);
        this.infoLayer.appendChild(Lbl.LevelStars);
        this.infoLayer.appendChild(Spt.LevelBalls);
        this.infoLayer.appendChild(Lbl.LevelBalls);
        this.infoLayer.appendChild(Lbl.PlayerScore);
        this.infoLayer.appendChild(Lbl.Menu);
        this.infoLayer.appendChild(Lbl.OK);
        this.infoLayer.appendChild(Lbl.Close);
        goog.events.listen(this.infoLayer, ['mousedown', 'touchend'], function(e){
            e.event.stopPropagation()
        });
        goog.events.listen(Lbl.Close, ['mousedown', 'touchend'], function(e){
            e.event.stopPropagation();
            ungravity.World.resume();
        });
        goog.events.listen(Spt.Close, ['mousedown', 'touchend'], function(e){
            e.event.stopPropagation();
            ungravity.World.resume();
        });
        goog.events.listen(Lbl.Menu, ['mousedown', 'touchend'], function(){
            ungravity.director.replaceScene(new ungravity.scenes.Levels(ungravity.World.episode), lime.transitions.Dissolve);
        });
        goog.events.listen(Lbl.OK, ['mousedown', 'touchend'], function(){
            if((typeof ungravity.World !== 'undefined') && (typeof ungravity.World.afterPause !== 'undefined')){
                ungravity.World.afterPause();
            }
        });
        this.appendChild(this.infoLayer);
    },

    /**
     * Creates and open a winner modal dialog
     * @return {undefined} Nothing returned
     */
    openWinModal: function() {
        this.infoLayer = new lime.Layer()
            .setAnchorPoint(0,0)
            .setPosition(0,0)
            .setSize(800, 480);
        this.infoLayer.setAnchorPoint(0.5, 0.5);
        this.infoLayer.setPosition(ungravity.settings.width/2, ungravity.settings.height/2);
        var Lbl = ungravity.scenes.Play.SpritesAndLabels.Labels.Modal;
        var Spt = ungravity.scenes.Play.SpritesAndLabels.Sprites.Modal;
        Lbl.LevelStars.setText(''+ungravity.Player.stars+' / '+ungravity.settings.starsPerLevel);
        Lbl.LevelBalls.setText(''+ungravity.World.goodballs.collected+'/'+ungravity.World.goodballs.total);
        Lbl.PlayerScore.setText('Score: '+ungravity.Player.getTotalPoints());
        Lbl.Title.setText('You win!!!');
        var txt = ungravity.settings.isTouch ? 'Tap' : 'Click';
        Lbl.MainText.setText(txt+' OK to continue');
        this.infoLayer.appendChild(Spt.Background);
        this.infoLayer.appendChild(Lbl.Title);
        this.infoLayer.appendChild(Lbl.MainText);
        this.infoLayer.appendChild(Spt.LevelStars);
        this.infoLayer.appendChild(Lbl.LevelStars);
        this.infoLayer.appendChild(Spt.LevelBalls);
        this.infoLayer.appendChild(Lbl.LevelBalls);
        this.infoLayer.appendChild(Lbl.PlayerScore);
        this.infoLayer.appendChild(Lbl.Replay);
        this.infoLayer.appendChild(Lbl.Menu);
        this.infoLayer.appendChild(Lbl.OK);
        goog.events.listen(this.infoLayer, ['mousedown', 'touchend'], function(e){
            e.event.stopPropagation();
        });
        goog.events.listen(Lbl.Replay, ['mousedown', 'touchend'], function(){
            ungravity.director.replaceScene(new ungravity.scenes.Play(ungravity.World.getLevelName()), lime.transitions.Dissolve);
        });
        goog.events.listen(Lbl.Menu, ['mousedown', 'touchend'], function(){
            ungravity.director.replaceScene(new ungravity.scenes.Levels(ungravity.World.episode), lime.transitions.Dissolve);
        });
        goog.events.listen(Lbl.OK, ['mousedown', 'touchend'], function(){
            if((typeof ungravity.World !== 'undefined') && (typeof ungravity.World.afterPause !== 'undefined')){
                ungravity.World.afterPause();
            }
        });
        this.appendChild(this.infoLayer);
    },

    /**
     * Removes any info modal dialog
     * @return {undefined} Nothing returned
     */
    closeInfoModal: function() {
        this.removeChild(this.infoLayer);
    }, 

    /**
     * On click changes the gravity
     * @return {undefined} Nothing returned
     */
    clickHandler: function() {
        ungravity.World.changeGravity();
    }
});

/**
 * An enumeration of modal types
 * @type {Object}
 */
ungravity.scenes.Play.ModalTypes = {
    'Start': 1,
    'Pause': 2,
    'Abort': 3,
    'Win': 4
};

/**
 * A hash containing the labels and sprites
 * @type {Object}
 */
ungravity.scenes.Play.SpritesAndLabels = {
    'Sprites':{
        'CtrlPanel':{
            //'Time': undefined,
            'Gravity': undefined,
            'LevelStars': undefined,
            'LevelBalls': undefined,
            'Prev': undefined,
            'Replay': undefined,
            'Next': undefined,
            'Pause': undefined,
            'Mute': undefined,
            'Menu': undefined
        },
        'Modal':{
            //'Time': undefined,
            'Background': undefined,
            'Close': undefined,
            'LevelStars': undefined,
            'LevelBalls': undefined,
            'Prev': undefined,
            'Next': undefined,
            'Mute': undefined
        }
    },
    'Labels':{
        'CtrlPanel':{
            //'Time': undefined,
            'LevelStars': undefined,
            'LevelBalls': undefined,
            'PlayerScore': undefined
        },
        'Modal':{
            //'Time': undefined,
            'LevelStars': undefined,
            'LevelBalls': undefined,
            'PlayerScore': undefined,
            'Title': undefined,
            'MainText': undefined,
            'Start': undefined,
            'OK': undefined,
            'Replay': undefined,
            'Menu': undefined,
            'Close': undefined
        }
    }
};

/**
 * Creates the world labels and sprites
 * @return {undefined} Nothing returned
 */
ungravity.scenes.Play.CreateSpritesAndLabels = function() {
    var controlSS = ungravity.Assets.SpriteSheets['assets/sprites/controlpanel'];
    var Lbl = ungravity.scenes.Play.SpritesAndLabels.Labels;
    var Spt = ungravity.scenes.Play.SpritesAndLabels.Sprites;
    //Creating Control Panel Labels
    for (var key in Lbl.CtrlPanel) {
        Lbl.CtrlPanel[key] = new lime.Label()
            .setFontFamily('Quantico')
            .setFontSize(16)
            .setFontColor('#222222')
            .setAnchorPoint(0, 0);
    };
    Lbl.CtrlPanel.LevelStars.setText('0/'+ungravity.settings.starsPerLevel)
        .setPosition(60, 135);
    Lbl.CtrlPanel.LevelBalls.setText('0/0')
        .setPosition(60, 170);
    Lbl.CtrlPanel.PlayerScore.setText('Score: 0')
        .setPosition(20, 205);
    //Creating Modal Labels
    for (var key in Lbl.Modal) {
        Lbl.Modal[key] = new lime.Label()
            .setFontFamily('Permanent Marker')
            .setFontSize(24)
            .setFontColor('#000')
            .setAnchorPoint(0.5, 0.5);
    };
    Lbl.Modal.LevelStars.setText('0/'+ungravity.settings.starsPerLevel)
        .setPosition(-190, 50);
    Lbl.Modal.LevelBalls.setText('0/0')
        .setPosition(10, 50);
    Lbl.Modal.PlayerScore.setText('Score: 0')
        .setPosition(190, 50);
    Lbl.Modal.Title.setText('Title')
        .setFontSize(32)
        .setPosition(0, -150);
    Lbl.Modal.MainText.setText('This is info')
        .setPosition(0, -50)
        .setSize(400, 100);
    Lbl.Modal.Start.setText('Start')
        .setFontSize(32)
        .setPosition(200, 150);
    Lbl.Modal.OK.setText('OK')
        .setFontSize(32)
        .setPosition(0, 150);
    Lbl.Modal.Replay.setText('Replay')
        .setFontSize(32)
        .setPosition(200, 150);
    Lbl.Modal.Menu.setText('Menu')
        .setFontSize(32)
        .setPosition(-200, 150);
    Lbl.Modal.Close.setText('Close')
        .setFontSize(32)
        .setPosition(200, 150);
    //Creating Control Panel Sprites
    for (var key in Spt.CtrlPanel) {
        Spt.CtrlPanel[key] = new lime.Sprite()
            .setAnchorPoint(0, 0)
            .setSize(32,32);
    };
    Spt.CtrlPanel.Gravity.setFill(controlSS.getFrame('down-brown.png'))
        .setSize(64,64)
        .setPosition(30, 50);
    Spt.CtrlPanel.LevelStars.setFill(controlSS.getFrame('star.png'))
        .setPosition(20, 128);
    Spt.CtrlPanel.LevelBalls.setFill(controlSS.getFrame('ball-brown.png'))
        .setPosition(20, 163);
    Spt.CtrlPanel.Prev.setFill(controlSS.getFrame('prev-brown.png'))
        .setPosition(10, 260);
    Spt.CtrlPanel.Replay.setFill(controlSS.getFrame('replay-brown.png'))
        .setPosition(48, 300);
    Spt.CtrlPanel.Next.setFill(controlSS.getFrame('next-brown.png'))
        .setPosition(86, 260);
    Spt.CtrlPanel.Pause.setFill(controlSS.getFrame('pause-brown.png'))
        .setPosition(10, 340);
    Spt.CtrlPanel.Mute.setFill(controlSS.getFrame('mute-brown.png'))
        .setPosition(86, 340);
    Spt.CtrlPanel.Menu.setFill(controlSS.getFrame('menu-brown.png'))
        .setSize(64,32)
        .setPosition(30, 400);
    //Creating Modal Sprites
    for (var key in Spt.Modal) {
        Spt.Modal[key] = new lime.Sprite()
            .setAnchorPoint(0.5, 0.5)
            .setSize(32,32);
    };
    Spt.Modal.Background = new lime.RoundedRect()
        .setFill(200,200,200)
        .setOpacity(0.90)
        .setSize(ungravity.settings.width-32, ungravity.settings.height-32)
        .setPosition(0, 0);
    Spt.Modal.Close.setFill(controlSS.getFrame('close.png'))
        .setPosition(((ungravity.settings.width-32)/2), ((-ungravity.settings.height-32)/2)+32);
    Spt.Modal.LevelStars.setFill(controlSS.getFrame('star.png'))
        .setPosition(-242, 50);
    Spt.Modal.LevelBalls.setFill(controlSS.getFrame('ball-brown.png'))
        .setPosition(-32, 50);
    Spt.Modal.Prev.setFill(controlSS.getFrame('prev-brown.png'))
        .setPosition(-60, 110);
    Spt.Modal.Next.setFill(controlSS.getFrame('next-brown.png'))
        .setPosition(60, 110);
    Spt.Modal.Mute.setFill(controlSS.getFrame('mute-brown.png'))
        .setPosition(-200, 200);
};