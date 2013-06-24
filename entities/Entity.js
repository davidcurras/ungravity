goog.provide('ungravity.entities.Entity');

goog.require('lime.Sprite');
goog.require('lime.Circle');
goog.require('box2d.PolygonShape');
goog.require('box2d.CircleShape');
goog.require('box2d.BodyDef');
goog.require('box2d.FixtureDef');

/**
 * Constructor
 * @return {ungravity.entities.Entity}
 */
ungravity.entities.Entity = function() { };

goog.object.extend(ungravity.entities.Entity.prototype, {

    /**
     * The object class identifier
     * @type {box2d.Body}
     */
    objClass: 'generic',

    /**
     * The box2d object
     * @type {box2d.Body}
     */
    b2dObject: undefined,

    /**
     * The lime object
     * @type {lime.Layer}
     */
    limeObject: undefined,

    /**
     * True if the entity has been drawn at least once
     * @type {lime.Layer}
     */
    drawn: false,

    /**
     * Removes Box2d object and LimeJS object from the world. Handles death actions.
     * @return {undefined} Nothing returned
     */
    die: function() { },

    /**
     * Basic entities are rendered with the background just once
     * @return {undefined} Nothing returned
     */
    render: function() { 
        this.drawn = true;
    }
});