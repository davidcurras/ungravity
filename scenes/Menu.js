goog.provide('ungravity.scenes.Menu');
goog.require('lime.Scene');

/**
 * @constructor
 * @extends {lime.Scene}
 * @return {ungravity.scenes.Menu}
 */
ungravity.scenes.Menu = function() {
    goog.base(this);    
    this.layer = new lime.Layer();
    var menuOptions = [
        {textImageName:'play', sprite:undefined, width:114, height:67, scene:ungravity.scenes.Episodes},
        {textImageName:'options', sprite:undefined, width:207, height:67, scene:ungravity.scenes.Options},
        {textImageName:'credits', sprite:undefined, width:207, height:56, scene:ungravity.scenes.Credits}
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
            var sprite = new lime.Sprite()
                .setFill(ungravity.Assets.Images['assets/texts/'+option.textImageName+'.png'])
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