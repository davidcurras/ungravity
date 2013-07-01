goog.provide('ungravity.scenes.Win');
goog.require('lime.Scene');

/**
 * @constructor
 * @extends {lime.Scene}
 * @return {ungravity.scenes.Win}
 */
ungravity.scenes.Win = function() {
    goog.base(this);
    this.layer = new lime.Layer();
    this.createLabels();
    this.appendChild(this.layer);
    goog.events.listen(this, ['mousedown', 'touchend'], this.clickHandler);
};

goog.inherits(ungravity.scenes.Win, lime.Scene);

goog.object.extend(ungravity.scenes.Win.prototype, {
    /**
     * The Win scene layer
     * @type {lime.Layer}
     */
    layer: undefined,

    /**
     * Creates the labels for credits
     * @return {undefined} Nothing returned
     */
    createLabels: function() {
        var anim = new lime.animation.FadeTo(1).setDuration(3);
        var defaultLabelHeight = 35;
        var creditLines = [
            {'text':'Congratulations!!!', 'font':'Permanent Marker', 'size':30},
            {'text':'You win the last level...', 'font':'Quantico', 'size':20},
            {'text':'Thanks for playing', 'font':'Quantico', 'size':20},
            {'text':' ', 'font':'Quantico', 'size':20},
            {'text':'EPISODE 3 comming soon...', 'font':'Permanent Marker', 'size':30},
            {'text':' ', 'font':'Permanent Marker', 'size':20},
            {'text':'Idea & Design & Programming', 'font':'Permanent Marker', 'size':30},
            {'text':'David Curras', 'font':'Quantico', 'size':24},
            {'text':' ', 'font':'Quantico', 'size':20},
            {'text':'Graphics & Music', 'font':'Permanent Marker', 'size':30},
            {'text':'Renzo Gustavino', 'font':'Quantico', 'size':24}
        ];
        for(var i in creditLines){
            var line = creditLines[i];
            var xPos = ungravity.settings.width/2;
            var yPos = (ungravity.settings.height/2) - ((defaultLabelHeight/2)*creditLines.length) + (defaultLabelHeight*i);
            var label = new lime.Label()
                .setText(line)
                .setFontFamily('Quantico')
                .setFontSize(20)
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
        ungravity.director.replaceScene(new ungravity.scenes.Menu(), lime.transitions.Dissolve);
    }
});