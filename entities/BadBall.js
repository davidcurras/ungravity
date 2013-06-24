goog.provide('ungravity.entities.BadBall');

goog.require('ungravity.entities.Ball');

/**
 * Constructor
 * @param  {Object} tmxObj The Tiled object with the Ball initial settings
 * @param  {ungravity.entities.World} world The current world where create the ball
 * @param  {String} color The ball color
 * @return {ungravity.entities.GoodBall}
 */
ungravity.entities.BadBall = function(tmxObj, world, color) {
    if(typeof color === 'undefined'){
        color = 'red';
    }
    goog.base(this, tmxObj, world, color);
    this.objClass = 'badball';
};

goog.inherits(ungravity.entities.BadBall, ungravity.entities.Ball);