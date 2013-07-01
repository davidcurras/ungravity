goog.provide('ungravity.scenes.Presentation');
goog.require('lime.Scene');

/**
 * @constructor
 * @extends {lime.Scene}
 * @return {ungravity.scenes.Presentation}
 */
ungravity.scenes.Presentation = function() {
    goog.base(this);
    this.layer = new lime.Layer().setAnchorPoint(0.5, 0.5);
    var controlSS = ungravity.Assets.SpriteSheets['assets/sprites/controlpanel'];
    var logo = new lime.Sprite()
        .setFill(ungravity.Assets.Images['assets/texts/ungravity.png'])
        .setAnchorPoint(0.5, 0.5)
        .setRotation(0)
        .setPosition(ungravity.settings.width/2, ungravity.settings.height/2)
        .setSize(798, 222);
    this.layer.appendChild(logo);
    var sprites = {
        'ball1':{
            'frame':'ball-brown.png',
            'fromX':250,
            'fromY':272,
            'toX':-20,
            'toY':272,
            'sprite':undefined
        },
        'ball2':{
            'frame':'ball-red.png',
            'fromX':51,
            'fromY':207,
            'toX':51,
            'toY':-20,
            'sprite':undefined
        },
        'ball3':{
            'frame':'ball-blue.png',
            'fromX':352,
            'fromY':210,
            'toX':352,
            'toY':ungravity.settings.height+20,
            'sprite':undefined
        },
        'ball4':{
            'frame':'ball-green.png',
            'fromX':582,
            'fromY':242,
            'toX':582,
            'toY':ungravity.settings.height+20,
            'sprite':undefined
        },
        'ball5':{
            'frame':'ball-purple.png',
            'fromX':684,
            'fromY':142,
            'toX':ungravity.settings.width+20,
            'toY':142,
            'sprite':undefined
        }
    };
    for(var key in sprites){
        sprites[key].sprite = new lime.Sprite()
            .setFill(controlSS.getFrame(sprites[key].frame))
            .setAnchorPoint(0.5, 0.5)
            .setSize(32,32)
            .setPosition(sprites[key].fromX, sprites[key].fromY);
        this.layer.appendChild(sprites[key].sprite);
    }
    ungravity.Assets.Sounds['assets/sounds/presentation'].play();
    var anim = this.animate(sprites);
    this.appendChild(this.layer);
    goog.events.listen(anim, lime.animation.Event.STOP, this.animationEndHandler);
};

goog.inherits(ungravity.scenes.Presentation, lime.Scene);

goog.object.extend(ungravity.scenes.Presentation.prototype, {
    /**
     * The Presentation scene layer
     * @type {lime.Layer}
     */
    layer: undefined,

    /**
     * Adds animations to the game logo
     * @param  {Object} sprites A hash with the sprites to animate
     * @return {lime.animation.Animation} The balls animations
     */
    animate: function(sprites) {
        var anim;
        for(var key in sprites){
            anim = new lime.animation.Sequence( 
                new lime.animation.Delay().setDuration(1.5),
                new lime.animation.MoveTo(sprites[key].toX, sprites[key].toY).setDuration(4)
            );
            anim.addTarget(sprites[key].sprite);
            anim.play();
        }
        return anim;
    },

    /**
     * When the animation ends, start showing the loading bar
     * @return {undefined} Nothing returned
     */
    animationEndHandler: function(){
        ungravity.director.replaceScene(new ungravity.scenes.Menu(), lime.transitions.Dissolve);
    }
});