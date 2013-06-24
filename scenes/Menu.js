goog.provide('ungravity.scenes.Menu');

goog.require('lime');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.ScaleBy');
goog.require('lime.animation.FadeTo');
goog.require('lime.transitions.Dissolve');
goog.require('ungravity.scenes.Episodes');
goog.require('ungravity.scenes.Credits');
goog.require('ungravity.scenes.Options');

/**
 * Constructor
 * @return {ungravity.scenes.Menu}
 */
ungravity.scenes.Menu = function() {
    goog.base(this);    
    this.layer = new lime.Layer();
    var menuOptions = [
        {img:'assets/texts/play.png', sprite:undefined, width:139, height:69, scene:ungravity.scenes.Episodes},
        {img:'assets/texts/options.png', sprite:undefined, width:211, height:69, scene:ungravity.scenes.Options},
        {img:'assets/texts/credits.png', sprite:undefined, width:209, height:69, scene:ungravity.scenes.Credits}
    ];
    this.createOptions(menuOptions);
    this.appendChild(this.layer);
    goog.events.listen(menuOptions[0].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new menuOptions[0].scene(), lime.transitions.Dissolve);
    });
    goog.events.listen(menuOptions[1].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new menuOptions[1].scene(), lime.transitions.Dissolve);
    });
    goog.events.listen(menuOptions[2].sprite, ['mousedown', 'touchend'], function() {
        ungravity.director.replaceScene(new menuOptions[2].scene(), lime.transitions.Dissolve);
    });

};

goog.inherits(ungravity.scenes.Menu, lime.Scene);

goog.object.extend(ungravity.scenes.Menu.prototype, {
    /**
     * The Menu scene layer
     * @type {lime.Layer}
     */
    layer: undefined,

    /**
     * Creates the menu options
     * @param {Array} menuOptions The menu options settings
     * @return {undefined} Nothing returned
     */
    createOptions: function(menuOptions) {
        var anim = new lime.animation.FadeTo(1).setDuration(3);
        var lblHeight = 70;
        var lblMargin = (ungravity.settings.height - (menuOptions.length*lblHeight))/(menuOptions.length+1);
        for(var i in menuOptions){
            var option = menuOptions[i];
            var xPos = ungravity.settings.width/2; 
            var yPos = i * (lblHeight + lblMargin);
            var sprite = new lime.Sprite().setFill(option.img)
                .setRotation(0)
                .setPosition(xPos, yPos+(lblHeight/2)+lblMargin)
                .setSize(option.width, option.height)
                .setOpacity(0);
            this.layer.appendChild(sprite);
            option.sprite = sprite;
            anim.addTarget(option.sprite);
        }
        anim.play();
    }
});