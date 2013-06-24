goog.provide('ungravity.ContactListener');

goog.require('box2d.ContactListener');

/**
 * Constructor
 * @return {ungravity.ContactListener}
 */
ungravity.ContactListener = function() {
    goog.base(this);
};

goog.inherits(ungravity.ContactListener, box2d.ContactListener);

goog.object.extend(ungravity.ContactListener.prototype, {

    /**
     * Called when two fixtures begin to touch
     * @param  {box2d.Contact} contact [description]
     * @return {undefined} Nothing returned
     */
    BeginContact: function (contact) {
        var keyA = contact.m_fixtureA.m_body.m_userData;
        var keyB = contact.m_fixtureB.m_body.m_userData;
        var objA = ungravity.World.objects[keyA];
        var objB = ungravity.World.objects[keyB];
        if(typeof objA !== 'undefined' && typeof objB !== 'undefined'){
            if(objA.objClass == 'star' && objB.objClass == 'goodball'){
                ungravity.entities.Star.sound.play();
                objA.die();
                delete ungravity.World.objects[keyA];
            } else if(objB.objClass == 'star' && objA.objClass == 'goodball'){
                ungravity.entities.Star.sound.play();
                objB.die();
                delete ungravity.World.objects[keyB];
            }
            if((objA.objClass == 'goal' && objB.objClass == 'goodball') || (objB.objClass == 'goal' && objA.objClass == 'goodball')){
                ungravity.entities.Goal.sound.play();
                var levelName = ungravity.Player.levelName;
                ungravity.Player.gamePoints[levelName] = ungravity.Player.stars * 10;
                var nextLevel = ungravity.World.getNextLevelName();
                ungravity.director.replaceScene(new ungravity.scenes.Play(nextLevel), lime.transitions.Dissolve);
            }
            if((objA.objClass == 'badball' && objB.objClass == 'goodball') || (objB.objClass == 'badball' && objA.objClass == 'goodball') ||
                (objA.objClass == 'badball' && objB.objClass == 'badball') || (objB.objClass == 'badball' && objA.objClass == 'badball') ||
                (objA.objClass == 'goodball' && objB.objClass == 'goodball') || (objB.objClass == 'goodball' && objA.objClass == 'goodball')){
                ungravity.entities.Ball.sound.play();
            }
            if((objA.objClass == 'wall' && objB.objClass == 'goodball') || (objB.objClass == 'wall' && objA.objClass == 'goodball')){
                var vA = ungravity.World.objects[keyA].b2dObject.m_linearVelocity;
                var vB = ungravity.World.objects[keyB].b2dObject.m_linearVelocity;
                var vMax = Math.max((vA.x+vA.y), (vB.x+vB.y));
                var volume = 1;
                if(vMax < 20){
                    volume = 1 - (1/vMax);
                }
                if(volume < 0){
                    volume = 0;
                }
                console.log(''+ungravity.entities.Wall.sound.getVolume()+' --> '+volume);
                ungravity.entities.Wall.sound.setVolume(volume);
                ungravity.entities.Wall.sound.play();
            }
        } else {
            //ungravity.log('ContactListener: Objects not found in the World.objects stack. ObjA: '+keyA+' ObjB'+keyB);
        }
            
    },

    /**
     * Called when two fixtures cease to touch
     * @param  {box2d.Contact} contact [description]
     * @return {undefined} Nothing returned
     */
    EndContact: function (contact) {},

    /**
     * This is called after a contact is updated
     * @param  {box2d.Contact} contact     [description]
     * @param  {[type]} oldManifold [description]
     * @return {undefined} Nothing returned
     */
    PreSolve: function (contact, oldManifold) {},

    /**
     * Allows to inspect a contact after the solver is finished
     * @param  {box2d.Contact} contact [description]
     * @param  {Number} impulse [description]
     * @return {undefined} Nothing returned
     */
    PostSolve: function (contact, impulse) {}
});