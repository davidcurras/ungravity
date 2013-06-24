goog.provide('ungravity.entities.GoodBall');

goog.require('ungravity.entities.Ball');

/**
 * Constructor
 * @param  {Object} tmxObj The Tiled object with the Ball initial settings
 * @param  {ungravity.entities.World} world The current world where create the ball
 * @param  {String} color The ball color
 * @return {ungravity.entities.GoodBall}
 */
ungravity.entities.GoodBall = function(tmxObj, world, color) {
    if(typeof color === 'undefined'){
        color = 'blue';
    }
    goog.base(this, tmxObj, world, color);
    this.objClass = 'goodball';
};

goog.inherits(ungravity.entities.GoodBall, ungravity.entities.Ball);
