goog.provide('ungravity.scenes.Loading');

goog.require('goog.net.ImageLoader');
goog.require('lime');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Label');
goog.require('lime.transitions.Dissolve');
goog.require('ungravity.scenes.Menu');

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
    this.images = [
        'assets/maps/tileset.png',
        'assets/sprites/ball.png',
        'assets/sprites/star.png',
        'assets/texts/credits.png',
        'assets/texts/options.png',
        'assets/texts/play.png',
        'assets/texts/ungravity.png'
    ];
    for (var i = 1; i <= ungravity.settings.episodes; i++) {
        for (var j = 1; j <= ungravity.settings.levelsPerEpisode; j++) {
            var levelName = ''+i;
            if(j < 10){
                levelName += '0';
            }
            levelName += j;
            this.images.push('assets/thumbnails/level'+levelName+'.png');
        }
        this.images.push('assets/thumbnails/episode'+i+'.png');
    };
    var imageLoader = new goog.net.ImageLoader();
    var that = this;
    goog.events.listen(imageLoader, goog.events.EventType.LOAD, function(e) { that.count++; });
    goog.events.listen(imageLoader, goog.net.EventType.COMPLETE, function(e) { 
        ungravity.director.replaceScene(new ungravity.scenes.Menu(), lime.transitions.Dissolve);
    });
    for (var i in this.images) {
        imageLoader.addImage(this.images[i], this.images[i]);
    };
    imageLoader.start();

    lime.scheduleManager.schedule(this.checkLoadedImages, this);
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
     * The images path to upload
     * @type {Array}
     */
    images: [],

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
     * 
     * Creates the label for Loading status
     * @param  {Number} dt The scheduler elapsed time
     * @return {undefined} Nothing returned
     */
    checkLoadedImages: function(dt) {
        this.label.setText('Loading... '+Math.floor(this.count*100/this.images.length)+'%');
    }
});