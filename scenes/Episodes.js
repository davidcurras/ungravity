goog.provide('ungravity.scenes.Episodes');

goog.require('lime');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.transitions.Dissolve');
goog.require('ungravity.scenes.Levels');

/**
 * Constructor
 * @return {ungravity.scenes.Episodes}
 */
ungravity.scenes.Episodes = function() {
    goog.base(this);
    this.layer = new lime.Layer();
    var episodes = [
        {'name':'1','sprite':undefined},
        {'name':'2','sprite':undefined}
    ];
    this.createEpisodesGrid(episodes);
    this.appendChild(this.layer);
    goog.events.listen(episodes[0].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new ungravity.scenes.Levels(episodes[0].name), lime.transitions.Dissolve);
    });
    goog.events.listen(episodes[1].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new ungravity.scenes.Levels(episodes[1].name), lime.transitions.Dissolve);
    });
};

goog.inherits(ungravity.scenes.Episodes, lime.Scene);

goog.object.extend(ungravity.scenes.Episodes.prototype, {
    /**
     * The Episodes scene layer
     * @type {lime.Layer}
     */
    layer: undefined,

    /**
     * Creates the sprites for the episodes grid
     * @param {Array} episodes The episode thumbnail settings
     * @return {undefined} Nothing returned
     */
    createEpisodesGrid: function(episodes) {
        var anim = new lime.animation.FadeTo(1).setDuration(2);
        var sptWidth = 158;
        var sptHeight = 222;
        var sptMargin = 30;
        for(var i in episodes){
            var episode = episodes[i];
            var xPos = (ungravity.settings.width/2) - (sptWidth+sptMargin)*episodes.length/2 + i*(sptWidth+sptMargin);
            var yPos = ungravity.settings.height/2;
            var episodeSprite = new lime.Sprite()
                .setFill('assets/thumbnails/episode'+episode.name+'.png')
                .setRotation(0)
                .setPosition(xPos+(sptWidth/2), yPos)
                .setSize(sptWidth, sptHeight)
                .setOpacity(0);
            this.layer.appendChild(episodeSprite);
            anim.addTarget(episodeSprite);
            episode.sprite = episodeSprite;
        }
        anim.play();
    }
});