goog.provide('ungravity.scenes.Info');
goog.require('lime.Scene');

/**
 * @constructor
 * @extends {lime.Scene}
 * @return {ungravity.scenes.Info}
 */
ungravity.scenes.Info = function() {
    goog.base(this);
    this.layer = new lime.Layer();
    this.createLabels();
    this.appendChild(this.layer);
    goog.events.listen(this, ['mousedown', 'touchend'], this.clickHandler);
};

goog.inherits(ungravity.scenes.Info, lime.Scene);

goog.object.extend(ungravity.scenes.Info.prototype, {
    /**
     * The Win scene layer
     * @type {lime.Layer}
     */
    layer: undefined,

    /**
     * Creates the labels for info
     * @return {undefined} Nothing returned
     */
    createLabels: function() {
        var anim = new lime.animation.FadeTo(1).setDuration(3);
        var defaultLabelHeight = 35;
        var txt = ungravity.settings.isTouch ? 'TAP' : 'CLICK';
        var infoLines = [
            {'text':' ', 'font':'Quantico', 'size':20},
            {'text':'Objective', 'font':'Permanent Marker', 'size':30},
            {'text':' ', 'font':'Quantico', 'size':20},
            {'text': 'Lead all balls to the goal by changing the gravity.', 'font':'Quantico', 'size':24},
            {'text': 'You can\'t control the gravity direction, it will', 'font':'Quantico', 'size':24},
            {'text': 'change randomly when you '+txt+' the screen.', 'font':'Quantico', 'size':24},
            {'text':' ', 'font':'Quantico', 'size':20},
            {'text':' ', 'font':'Quantico', 'size':20},
            {'text':'Controls', 'font':'Permanent Marker', 'size':30},
            {'text':' ', 'font':'Quantico', 'size':20},
            {'text':txt+' the screen to change the gravity.', 'font':'Quantico', 'size':24}
        ];
        for(var i in infoLines){
            var line = infoLines[i];
            var xPos = ungravity.settings.width/2;
            var yPos = (ungravity.settings.height/2) - ((defaultLabelHeight/2)*infoLines.length) + (defaultLabelHeight*i);
            var label = new lime.Label()
                .setText(line.text)
                .setFontFamily(line.font)
                .setFontSize(line.size)
                .setFontColor('#ffffff')
                .setAnchorPoint(0.5, 0.5)
                .setPosition(xPos, yPos);
            this.layer.appendChild(label);
            anim.addTarget(label);
        }
        anim.play();
    },

    /**
     * On click replaces the Win scene with the Menu scene
     * @return {undefined} Nothing returned
     */
    clickHandler: function() {
        ungravity.director.replaceScene(new ungravity.scenes.Episodes(), lime.transitions.Dissolve);
    }
});