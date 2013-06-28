goog.provide('ungravity.scenes.Loading');

goog.require('lime');
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Label');
goog.require('lime.SpriteSheet');
goog.require('lime.parser.JSON');
goog.require('lime.parser.TMX');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.fill.Frame');
goog.require('lime.fill.Image');
goog.require('lime.ASSETS.ball.json');
goog.require('lime.ASSETS.controls.json');
goog.require('lime.ASSETS.star.json');
goog.require('lime.audio.Audio');
goog.require('ungravity.entities.Ball');
goog.require('ungravity.entities.Goal');
goog.require('ungravity.entities.Star');
goog.require('ungravity.entities.Wall');

/**
 * Constructor
 * @return {ungravity.scenes.Loading}
 */
ungravity.scenes.Loading = function() {
    goog.base(this);
    this.layer = new lime.Layer();
    this.createLabel();
    this.appendChild(this.layer);
    var i = 0;
    this.fillAssetList();
    for (var typeKey in ungravity.Assets) {
        for (var assetKey in ungravity.Assets[typeKey]) {
            var asset = ungravity.Assets[typeKey][assetKey];
            try {
                this.loadAsset(assetKey, typeKey);
            } catch (e) {
                ungravity.log('scenes.Loading at line 37:\t\t'+e.message, 'err');
                this.checkLoadedAssets();
            }
        }
    }
};

goog.inherits(ungravity.scenes.Loading, lime.Scene);

goog.object.extend(ungravity.scenes.Loading.prototype, {

    /**
     * The Loading scene layer
     * @type {lime.Layer}
     */
    layer: undefined,

    /**
     * The progress label
     * @type {lime.Label}
     */
    label: undefined,

    /**
     * The already loaded images
     * @type {Number}
     */
    count: 0,

    /**
     * Creates the label for Loading status
     * @return {undefined} Nothing returned
     */
    createLabel: function() {
        this.label = new lime.Label()
            .setText('Loading... ')
            .setFontFamily('Verdana')
            .setFontSize(16)
            .setFontColor('#ffffff')
            .setAnchorPoint(0.5, 0.5)
            .setPosition(ungravity.settings.width/2, ungravity.settings.height/2);
        this.layer.appendChild(this.label);
    },

    /**
     * Adds thumbnails and maps to the assets list
     * @return {undefined} Nothing returned
     */
    fillAssetList: function() {
        for (var i = 1; i <= ungravity.settings.episodes; i++) {
            for (var j = 1; j <= ungravity.settings.levelsPerEpisode; j++) {
                var levelName = ''+i;
                if(j < 10){
                    levelName += '0';
                }
                levelName += j;
                ungravity.Assets.Maps['assets/maps/map'+levelName+'.tmx'] = null;
                ungravity.Assets.Images['assets/thumbnails/level'+levelName+'.png'] = null;
            }
            ungravity.Assets.Images['assets/thumbnails/episode'+i+'.png'] = null;
        }
        ungravity.Assets.Total += Object.keys(ungravity.Assets.Images).length;
        ungravity.Assets.Total += Object.keys(ungravity.Assets.Maps).length;
        ungravity.Assets.Total += Object.keys(ungravity.Assets.SpriteSheets).length * 2;
        ungravity.Assets.Total += Object.keys(ungravity.Assets.Sounds).length;
    },

    /**
     * Downloads the asset file and creates/stores the object if needed
     * @param  {String} asset The assets src
     * @param  {String} type  The asset type
     * @return {undefined} Nothing returned
     */
    loadAsset: function(src, type){
        var newObj = null;
        var callbackFn = null;
        var hasCallbackFn = false;
        var that = this;
        switch(type.toUpperCase()){
            case 'IMAGES':
            case 'IMAGE':
            case 'SPRITESHEETIMAGE':
                newObj = new Image();
                callbackFn = function () {
                    lime.fill.Image.loadedImages_[src] = newObj;
                    if(type.toUpperCase() == 'IMAGES' || type.toUpperCase() == 'IMAGE'){
                        ungravity.Assets.Images[src] = new lime.fill.Image(src);
                    }
                    that.checkLoadedAssets();
                };
                hasCallbackFn = true;
                break;
            case 'MAPS':
            case 'MAP':
            case 'SPRITESHEETSCRIPT':
            case 'SCRIPTS':
            case 'SCRIPT':
                if (window.XMLHttpRequest) {
                    newObj = new XMLHttpRequest();
                } else {
                    newObj = new ActiveXObject("Microsoft.XMLHTTP");
                }
                newObj.open("GET", src, true);
                callbackFn = function () {
                    if(type.toUpperCase() == 'MAPS' || type.toUpperCase() == 'MAP'){
                        ungravity.Assets.Maps[src] = new lime.parser.TMX(src);
                    } else if(type.toUpperCase() == 'SPRITESHEETSCRIPT'){
                        var objKey = src.substr(0, src.indexOf('.'));
                        var ssName = objKey.substr(objKey.lastIndexOf('/')+1);
                        ungravity.Assets.SpriteSheets[objKey] = new lime.SpriteSheet(objKey+'.png', lime.ASSETS[ssName].json, lime.parser.JSON);
                    }
                    that.checkLoadedAssets();
                };
                hasCallbackFn = true;
                break;
            case 'SPRITESHEETS':
            case 'SPRITESHEET':
                this.loadAsset(src+'.json.js', 'spritesheetscript');
                this.loadAsset(src+'.png', 'spritesheetimage');
                hasCallbackFn = false;
                break;
            case 'SOUNDS':
            case 'SOUND':
                if (window.XMLHttpRequest) {
                    newObj = new XMLHttpRequest();
                } else {
                    newObj = new ActiveXObject("Microsoft.XMLHTTP");
                }
                newObj.open("GET", src+'.'+ungravity.settings.audioFileExtension, true);
                newObj.responseType = 'arraybuffer';
                callbackFn = function () {
                    ungravity.Assets.Sounds[src] = new lime.audio.Audio(src+'.'+ungravity.settings.audioFileExtension);
                    that.checkLoadedAssets();
                };
                hasCallbackFn = true;
                break;
            default:
                throw 'Unable to load "'+src+'" of type '+type;
        }
        if(hasCallbackFn){
            newObj.onload = callbackFn;
        }
        if(type.toUpperCase() == 'IMAGE' || type.toUpperCase() == 'IMAGES' || type.toUpperCase() == 'SPRITESHEETIMAGE'){
            newObj.src = src;
        } else if(type.toUpperCase() != 'SPRITESHEETS' && type.toUpperCase() != 'SPRITESHEET'){
            newObj.send();
        }
    },

    /**
     * Replace the current scene with scenes.Presentation when all assets are loaded
     * @return {undefined} Nothing returned
     */
    checkLoadedAssets: function () {
        ++ungravity.Assets.Loaded;
        if(ungravity.Assets.Loaded >= ungravity.Assets.Total) {
            this.label.setText('Loading... 100%');
            ungravity.entities.Ball.sound = ungravity.Assets.Sounds['assets/sounds/ballCollision'];
            ungravity.entities.Goal.sound = ungravity.Assets.Sounds['assets/sounds/win'];
            ungravity.entities.Star.sound = ungravity.Assets.Sounds['assets/sounds/star'];
            ungravity.entities.Wall.sound = ungravity.Assets.Sounds['assets/sounds/wallBounce'];
            ungravity.director.replaceScene(new ungravity.scenes.Presentation());
        } else {
            this.label.setText('Loading... '+Math.floor(ungravity.Assets.Loaded*100/ungravity.Assets.Total)+'%');
        }
    }
});