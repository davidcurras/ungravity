goog.provide('ungravity.entities.Wall');

goog.require('lime.audio.Audio');
goog.require('ungravity.entities.Entity');

/**
 * Constructor
 * @param  {Object} tmxObj The Tiled object with the Wall initial settings
 * @param  {ungravity.entities.World} world The current world where create walls
 * @return {ungravity.entities.Wall}
 */
ungravity.entities.Wall = function(tmxObj, world) {
    goog.base(this);
    this.objClass = 'wall';
    var px = tmxObj.px + (tmxObj.width/2);
    var py = tmxObj.py + (tmxObj.height/2);
    var mult = ungravity.settings.b2dMultiplier;
    var shape = new box2d.PolygonShape();
    shape.SetAsBox((tmxObj.width/2)/mult, (tmxObj.height/2)/mult);
    var def = new box2d.BodyDef();
    def.position.Set(px/mult, py/mult);
    var fixture = new box2d.FixtureDef();
    fixture.density = 0;
    fixture.restitution = 0.5;
    fixture.friction = 1;
    fixture.shape = shape;
    fixture.isSensor = false;
    this.b2dObject = world.b2dObject.CreateBody(def);
    this.b2dObject.CreateFixture(fixture);
    this.b2dObject.SetUserData(tmxObj.name);
    this.limeObject = undefined;
};

goog.inherits(ungravity.entities.Wall, ungravity.entities.Entity);

//goog.object.extend(ungravity.entities.Wall.prototype, { });
//
ungravity.entities.Wall.sound = new lime.audio.Audio('assets/sounds/bounce2.'+ungravity.settings.audioFileExtension);