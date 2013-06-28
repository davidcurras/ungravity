goog.provide('ungravity.entities.Ball');

goog.require('lime.SpriteSheet');
goog.require('lime.parser.JSON');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.fill.Frame');
goog.require('lime.ASSETS.ball.json');
goog.require('lime.audio.Audio');
goog.require('ungravity.entities.Entity');

/**
 * Constructor
 * @param  {Object} tmxObj The Tiled object with the Ball initial settings
 * @param  {ungravity.entities.World} world The current world where create the ball
 * @param  {String} color The ball color
 * @return {ungravity.entities.Ball}
 */
ungravity.entities.Ball = function(tmxObj, world, color) {
    goog.base(this);
    this.objClass = 'ball';
    this.spriteSheet = ungravity.Assets.SpriteSheets['assets/sprites/ball'];
    var px = tmxObj.px + (tmxObj.width/2);
    var py = tmxObj.py + (tmxObj.height/2);
    var mult = ungravity.settings.b2dMultiplier;
    var shape = new box2d.CircleShape();
    shape.m_radius = (tmxObj.width/2)/mult;
    var def = new box2d.BodyDef();
    def.position.Set(px/mult, py/mult);
    def.type = box2d.Body.b2_dynamicBody;
    var fixture = new box2d.FixtureDef();
    fixture.density = 1;
    fixture.restitution = 0.4;
    fixture.friction = 1;
    fixture.shape = shape;
    fixture.isSensor = false;
    this.b2dObject = world.b2dObject.CreateBody(def);
    this.b2dObject.CreateFixture(fixture);
    //this.b2dObject.isBullet = true;
    this.b2dObject.SetUserData(tmxObj.name);
    var frame = this.spriteSheet.getFrame(color+'-ball-live-01.png');
    this.limeObject = new lime.Circle().setFill(frame).setSize(32, 32).setPosition(px, py);
    var anim = new lime.animation.KeyframeAnimation();
    anim.delay= 1/5;
    for(var i=1;i<=5;i++){
        frame = this.spriteSheet.getFrame(color+'-ball-live-0'+i+'.png');
        anim.addFrame(frame);
    }
    this.limeObject.runAction(anim);
    this.render(world);
};

goog.inherits(ungravity.entities.Ball, ungravity.entities.Entity);

goog.object.extend(ungravity.entities.Ball.prototype, {

    /**
     * The TexturePacker json file with the sprite sheet for ball animation
     * @type {lime.SpriteSheet}
     */
    spriteSheet: undefined,

    /**
     * Renders the ball state
     * @param  {ungravity.entities.World} world The current world where update the ball
     * @return {undefined} Nothing returned
     */
    render: function(world) {
        if(!this.drawn){
            world.container.objLayer.appendChild(this.limeObject);
            this.drawn = true;
        }
        var pos = this.b2dObject.GetPosition();
        var rot = this.b2dObject.GetAngle();
        this.limeObject.setRotation(-rot/Math.PI*180);
        this.limeObject.setPosition(pos.x*10, pos.y*10);
    }
});

ungravity.entities.Ball.sound = undefined;