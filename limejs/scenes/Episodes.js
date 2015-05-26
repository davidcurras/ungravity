goog.provide('ungravity.scenes.Episodes');
goog.require('lime.Scene');

/**
 * @constructor
 * @extends {lime.Scene}
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
        var sptHeight = 350;
        var sptMargin = 30;
        var chooseLabel = new lime.Label()
            .setText('Choose an episode')
            .setAlign('center')
            .setPosition(-20, 20)
            .setSize(ungravity.settings.width,25)
            .setAnchorPoint(0, 0)
            .setFontFamily('Permanent Marker')
            .setFontSize(26)
            .setFontColor('#EEE');
        this.layer.appendChild(chooseLabel);
        for(var i in episodes){
            var episode = episodes[i];
            var xPos = (ungravity.settings.width/2) - (sptWidth+sptMargin)*episodes.length/2 + i*(sptWidth+sptMargin);
            var yPos = ungravity.settings.height/2;
            var episodeSprite = new lime.Sprite()
                .setFill(ungravity.Assets.Images['assets/thumbnails/episode'+episode.name+'.png'])
                .setRotation(0)
                .setPosition(xPos+(sptWidth/2), yPos)
                .setSize(sptWidth, sptHeight)
                .setOpacity(0);
            var episodeLabel = new lime.Label()
                .setText('Episode '+episode.name)
                .setPosition(0, -150)
                .setSize(sptWidth-30,25)
                .setAnchorPoint(0.5, 0)
                .setFontFamily('Quantico')
                .setFontSize(16)
                .setFontColor('#222222');
            var hintLabel = new lime.Label()
                .setText('Collect as many stars as you can!!!')
                .setPosition(0, -70)
                .setSize(sptWidth-30,50)
                .setAnchorPoint(0.5, 0)
                .setFontFamily('Quantico')
                .setFontSize(16)
                .setFontColor('#222222');
            episodeSprite.appendChild(episodeLabel);
            episodeSprite.appendChild(hintLabel);
            this.layer.appendChild(episodeSprite);
            anim.addTarget(episodeSprite);
            episode.sprite = episodeSprite;
        }
        var back = new lime.Sprite()
            .setFill(ungravity.Assets.SpriteSheets['assets/sprites/controlpanel'].getFrame('back-'+ungravity.settings.colors['episode'+episode.name]+'.png'))
            .setSize(64,32)
            .setPosition(525, 445);
        anim.addTarget(back);
        anim.addTarget(chooseLabel);
        this.layer.appendChild(back);
        anim.play();
        goog.events.listen(back, ['mousedown', 'touchend'], function() {
            ungravity.director.replaceScene(new ungravity.scenes.Menu(), lime.transitions.Dissolve);
        });
    }
});