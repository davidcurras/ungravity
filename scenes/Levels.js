goog.provide('ungravity.scenes.Levels');
goog.require('lime.Scene');

/**
 * @constructor
 * @extends {lime.Scene}
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
    if(typeof ungravity.Player.levelStars[levels[0].name] !== 'undefined'){
        goog.events.listen(levels[0].sprite, ['mousedown', 'touchend'], function() {
            ungravity.director.replaceScene(new ungravity.scenes.Play(levels[0].name), lime.transitions.Dissolve);
        });
    }
    if(typeof ungravity.Player.levelStars[levels[1].name] !== 'undefined'){
        goog.events.listen(levels[1].sprite, ['mousedown', 'touchend'], function() {
            ungravity.director.replaceScene(new ungravity.scenes.Play(levels[1].name), lime.transitions.Dissolve);
        });
    }
    if(typeof ungravity.Player.levelStars[levels[2].name] !== 'undefined'){
        goog.events.listen(levels[2].sprite, ['mousedown', 'touchend'], function() {
            ungravity.director.replaceScene(new ungravity.scenes.Play(levels[2].name), lime.transitions.Dissolve);
        });
    }
    if(typeof ungravity.Player.levelStars[levels[3].name] !== 'undefined'){
        goog.events.listen(levels[3].sprite, ['mousedown', 'touchend'], function() {
            ungravity.director.replaceScene(new ungravity.scenes.Play(levels[3].name), lime.transitions.Dissolve);
        });
    }
    if(typeof ungravity.Player.levelStars[levels[4].name] !== 'undefined'){
        goog.events.listen(levels[4].sprite, ['mousedown', 'touchend'], function() {
            ungravity.director.replaceScene(new ungravity.scenes.Play(levels[4].name), lime.transitions.Dissolve);
        });
    }
    if(typeof ungravity.Player.levelStars[levels[5].name] !== 'undefined'){
        goog.events.listen(levels[5].sprite, ['mousedown', 'touchend'], function() {
            ungravity.director.replaceScene(new ungravity.scenes.Play(levels[5].name), lime.transitions.Dissolve);
        });
    }
    if(typeof ungravity.Player.levelStars[levels[6].name] !== 'undefined'){
        goog.events.listen(levels[6].sprite, ['mousedown', 'touchend'], function() {
            ungravity.director.replaceScene(new ungravity.scenes.Play(levels[6].name), lime.transitions.Dissolve);
        });
    }
    if(typeof ungravity.Player.levelStars[levels[7].name] !== 'undefined'){
        goog.events.listen(levels[7].sprite, ['mousedown', 'touchend'], function() {
            ungravity.director.replaceScene(new ungravity.scenes.Play(levels[7].name), lime.transitions.Dissolve);
        });
    }
    if(typeof ungravity.Player.levelStars[levels[8].name] !== 'undefined'){
        goog.events.listen(levels[8].sprite, ['mousedown', 'touchend'], function() {
            ungravity.director.replaceScene(new ungravity.scenes.Play(levels[8].name), lime.transitions.Dissolve);
        });
    }
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
        var episodeNumber = levels[0].name.substring(0,1);
        var anim = new lime.animation.FadeTo(1).setDuration(3);
        var sptWidth = 100;
        var sptHeight = 75;
        var sptMargin = 50;
        var levelsPerRow = 3;
        var rows = Math.ceil(levels.length/levelsPerRow);
        var chooseLabel = new lime.Label()
            .setText('Choose a level')
            .setAlign('center')
            .setPosition(-15, 15)
            .setSize(ungravity.settings.width,25)
            .setAnchorPoint(0, 0)
            .setFontFamily('Permanent Marker')
            .setFontSize(26)
            .setFontColor('#EEE');
        this.layer.appendChild(chooseLabel);
        for(var i in levels){
            var level = levels[i];
            var xPos = (ungravity.settings.width/2) - (sptWidth+sptMargin)*levelsPerRow/2 + (i%levelsPerRow)*(sptWidth+sptMargin);
            var yPos = (ungravity.settings.height/2) - (sptHeight+sptMargin)*rows/2 + Math.floor(i/rows)*(sptHeight+sptMargin);
            var playerStars = ungravity.Player.levelStars[level.name];
            var lockText = typeof playerStars === 'undefined' ? '-locked' : '';
            var levelSprite = new lime.Sprite()
                .setFill(ungravity.Assets.Images['assets/thumbnails/level'+level.name+lockText+'.png'])
                .setRotation(0)
                .setPosition(xPos+(sptWidth/2), yPos+(sptHeight/2))
                .setSize(sptWidth, sptHeight)
                .setOpacity(0);
            this.layer.appendChild(levelSprite);
            if(typeof playerStars !== 'undefined'){
                var levelStars = Math.floor(playerStars/6);
                for (var j = 1; j <= levelStars; j++) {
                    var xPosStar = (j%levelStars)*(16+3) - ((16+3)*levelStars)/2;
                    var starSprite = new lime.Sprite()
                        .setFill(ungravity.Assets.SpriteSheets['assets/sprites/controlpanel'].getFrame('star.png'))
                        .setRotation(0)
                        .setPosition(xPosStar+(16/2), (sptHeight/2)+16)
                        .setSize(16, 16)
                        .setOpacity(1);
                    levelSprite.appendChild(starSprite);
                };
            }
            anim.addTarget(levelSprite);
            level.sprite = levelSprite;
        }
        var back = new lime.Sprite()
            .setFill(ungravity.Assets.SpriteSheets['assets/sprites/controlpanel'].getFrame('back-'+ungravity.settings.colors['episode'+episodeNumber]+'.png'))
            .setSize(64,32)
            .setPosition(525, 445);
        anim.addTarget(back);
        anim.addTarget(chooseLabel);
        this.layer.appendChild(back);
        anim.play();
        goog.events.listen(back, ['mousedown', 'touchend'], function() {
            ungravity.director.replaceScene(new ungravity.scenes.Episodes(), lime.transitions.Dissolve);
        });
    }
});