goog.provide('ungravity.entities.Goal');

goog.require('lime.audio.Audio');
goog.require('ungravity.entities.Entity');

/**
 * Constructor
 * @param  {Object} tmxObj The Tiled object with the Goal initial settings
 * @param  {ungravity.entities.World} world The current world where create walls
 * @return {ungravity.entities.Goal}
 */
ungravity.entities.Goal = function(tmxObj, world) {
    goog.base(this);
    this.objClass = 'goal';
    var px = tmxObj.px + (tmxObj.width/2);
    var py = tmxObj.py + (tmxObj.height/2);
    var mult = ungravity.settings.b2dMultiplier;
    var shape = new box2d.CircleShape();
    shape.m_radius = (tmxObj.width/2)/mult;
    var def = new box2d.BodyDef();
    def.position.Set(px/mult, py/mult);
    var fixture = new box2d.FixtureDef();
    fixture.density = 0; //Static body
    fixture.restitution = 0;
    fixture.friction = 0;
    fixture.shape = shape;
    fixture.isSensor = true;
    this.b2dObject = world.b2dObject.CreateBody(def);
    this.b2dObject.CreateFixture(fixture);
    this.b2dObject.SetUserData(tmxObj.name);
    this.limeObject = undefined;
    this.render(world);
};

goog.inherits(ungravity.entities.Goal, ungravity.entities.Entity);

//goog.object.extend(ungravity.entities.Goal.prototype, { });
//
ungravity.entities.Goal.sound = undefined;