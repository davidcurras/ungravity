goog.provide('ungravity.scenes.Levels');

goog.require('lime');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.transitions.Dissolve');
goog.require('ungravity.scenes.Play');

/**
 * Constructor
 * @param  {String} episode The episode number
 * @return {ungravity.scenes.Levels}
 */
ungravity.scenes.Levels = function(episode) {
    goog.base(this);
    this.layer = new lime.Layer();
    var levels = [];
    for (var i = 1; i <= ungravity.settings.levelsPerEpisode; i++) {
        var levelName = episode;
        if(i < 10){
            levelName += '0';
        }
        levels.push({'name':levelName+i,'sprite':undefined});
    };
    this.createLevelsGrid(levels);
    this.appendChild(this.layer);
    goog.events.listen(levels[0].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new ungravity.scenes.Play(levels[0].name), lime.transitions.Dissolve);
    });
    goog.events.listen(levels[1].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new ungravity.scenes.Play(levels[1].name), lime.transitions.Dissolve);
    });
    goog.events.listen(levels[2].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new ungravity.scenes.Play(levels[2].name), lime.transitions.Dissolve);
    });
    goog.events.listen(levels[3].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new ungravity.scenes.Play(levels[3].name), lime.transitions.Dissolve);
    });
    goog.events.listen(levels[4].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new ungravity.scenes.Play(levels[4].name), lime.transitions.Dissolve);
    });
    goog.events.listen(levels[5].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new ungravity.scenes.Play(levels[5].name), lime.transitions.Dissolve);
    });
    goog.events.listen(levels[6].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new ungravity.scenes.Play(levels[6].name), lime.transitions.Dissolve);
    });
    goog.events.listen(levels[7].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new ungravity.scenes.Play(levels[7].name), lime.transitions.Dissolve);
    });
    goog.events.listen(levels[8].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new ungravity.scenes.Play(levels[8].name), lime.transitions.Dissolve);
    });
};

goog.inherits(ungravity.scenes.Levels, lime.Scene);

goog.object.extend(ungravity.scenes.Levels.prototype, {
    /**
     * The Levels scene layer
     * @type {lime.Layer}
     */
    layer: undefined,

    /**
     * Creates the sprites for the levels grid
     * @param {Array} levels The level thumbnail settings
     * @return {undefined} Nothing returned
     */
    createLevelsGrid: function(levels) {
        var anim = new lime.animation.FadeTo(1).setDuration(3);
        var sptWidth = 100;
        var sptHeight = 75;
        var sptMargin = 50;
        var levelsPerRow = 3;
        var rows = Math.ceil(levels.length/levelsPerRow);
        for(var i in levels){
            var level = levels[i];
            var xPos = (ungravity.settings.width/2) - (sptWidth+sptMargin)*levelsPerRow/2 + (i%levelsPerRow)*(sptWidth+sptMargin);
            var yPos = (ungravity.settings.height/2) - (sptHeight+sptMargin)*rows/2 + Math.floor(i/rows)*(sptHeight+sptMargin);
            var levelSprite = new lime.Sprite()
                .setFill('assets/thumbnails/level'+level.name+'.png')
                .setRotation(0)
                .setPosition(xPos+(sptWidth/2), yPos+(sptHeight/2))
                .setSize(sptWidth, sptHeight)
                .setOpacity(0);
            this.layer.appendChild(levelSprite);
            anim.addTarget(levelSprite);
            level.sprite = levelSprite;
        }
        anim.play();
    }
});