goog.provide('ungravity.entities.Star');
goog.require('ungravity.entities.Entity');

/**
 * @constructor
 * @extends {ungravity.entities.Entity}
 * @param  {Object} tmxObj The Tiled object with the Star initial settings
 * @param  {ungravity.entities.World} world The current world where create walls
 * @return {ungravity.entities.Star}
 */
ungravity.entities.Star = function(tmxObj, world) {
    goog.base(this);
    this.objClass = 'star';
    this.spriteSheet = ungravity.Assets.SpriteSheets['assets/sprites/staranim'];
    var px = tmxObj.px + (tmxObj.width/2);
    var py = tmxObj.py + (tmxObj.height/2);
    var mult = ungravity.settings.b2dMultiplier;
    var shape = new box2d.PolygonShape();
    shape.SetAsBox((tmxObj.width/2)/mult, (tmxObj.height/2)/mult);
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
    var extraPx = 8; //Pixels outside the box2d star shape
    var frame = this.spriteSheet.getFrame('star-01.png');
    this.limeObject = new lime.Sprite().setFill(frame).setSize(tmxObj.width+extraPx, tmxObj.height+extraPx).setPosition(px-(extraPx/2), py-(extraPx/2));
    var anim = new lime.animation.KeyframeAnimation();
    anim.delay= 1/12;
    for(var i=1;i<=12;i++){
        var spriteName = 'star-';
        if(i < 10){
            spriteName += '0';
        }
        spriteName += i+'.png';
        frame = this.spriteSheet.getFrame(spriteName);
        anim.addFrame(frame);
    }
    this.limeObject.runAction(anim);
    this.render(world);
};

goog.inherits(ungravity.entities.Star, ungravity.entities.Entity);

goog.object.extend(ungravity.entities.Star.prototype, {

    /**
     * The TexturePacker json file with the sprite sheet for star animation
     * @type {lime.SpriteSheet}
     */
    spriteSheet: undefined,

    /**
     * Removes Box2d object and LimeJS object from the world. Adds one point to the player.
     * @return {undefined} Nothing returned
     */
    die: function() {
        ungravity.Player.stars++;
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
    },

    /**
     * Renders the star just once
     * @param  {ungravity.entities.World} world the current world where create entities
     * @return {undefined} Nothing returned
     */
    render: function(world) {
        world.container.objLayer.appendChild(this.limeObject);
        this.drawn = true;
    }

});

ungravity.entities.Star.sound = undefined;