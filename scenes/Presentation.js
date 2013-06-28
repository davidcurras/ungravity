goog.provide('ungravity.scenes.Presentation');

goog.require('lime');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.ScaleBy');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.Delay');
goog.require('lime.transitions.Dissolve');
goog.require('ungravity.scenes.Menu');

/**
 * Constructor
 * @return {ungravity.scenes.Presentation}
 */
ungravity.scenes.Presentation = function() {
    goog.base(this);
    this.layer = new lime.Layer();
    var logo = new lime.Sprite()
        .setFill('assets/texts/ungravity.png')
        .setRotation(10)
        .setPosition(ungravity.settings.width/2, ungravity.settings.height/2)
        .setSize(35, 10)
        .setOpacity(0);
    var anim = this.animate(logo);
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
     * @param  {lime.Sprite} logo The game logo
     * @return {lime.animation.Animation} The logo animation
     */
    animate: function(logo) {
        var anim = new lime.animation.Sequence(
            new lime.animation.Spawn( new lime.animation.ScaleBy(10).setDuration(5), new lime.animation.FadeTo(1).setDuration(5)),
            new lime.animation.Delay().setDuration(1.5),
            new lime.animation.Spawn( new lime.animation.ScaleBy(2).setDuration(2), new lime.animation.FadeTo(0).setDuration(2))
        );
        this.layer.appendChild(logo);
        anim.addTarget(logo);
        anim.play();
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