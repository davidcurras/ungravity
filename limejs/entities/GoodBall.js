goog.provide('ungravity.entities.GoodBall');
goog.require('ungravity.entities.Ball');

/**
 * @constructor
 * @extends {ungravity.entities.Ball}
 * @param  {Object} tmxObj The Tiled object with the Ball initial settings
 * @param  {ungravity.entities.World} world The current world where create the ball
 * @param  {String} color The ball color
 * @return {ungravity.entities.GoodBall}
 */
ungravity.entities.GoodBall = function(tmxObj, world, color) {
    if(typeof color === 'undefined'){
        color = 'brown';
    }
    goog.base(this, tmxObj, world, color);
    this.objClass = 'goodball';
};

goog.inherits(ungravity.entities.GoodBall, ungravity.entities.Ball);

goog.object.extend(ungravity.entities.GoodBall.prototype, {

    /**
     * Removes Box2d object and LimeJS object from the world. Adds one point to the player.
     * @return {undefined} Nothing returned
     */
    die: function() {
        ++ungravity.World.goodballs.collected;
        ungravity.World.dieList.push(this.b2dObject.GetUserData());
        var sprite = this.limeObject;
        var anim = new lime.animation.Spawn( 
            new lime.animation.ScaleBy(0.1).setEasing(lime.animation.Easing.EASEOUT).setDuration(1), 
            new lime.animation.FadeTo(0).setDuration(1)
        );
        anim.addTarget(sprite);
        anim.play();
        goog.events.listen(anim, lime.animation.Event.STOP, function(){
            ungravity.World.container.objLayer.removeChild(sprite);
        });
    }

});