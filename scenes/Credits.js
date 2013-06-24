goog.provide('ungravity.scenes.Credits');

goog.require('lime');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Label');
goog.require('lime.transitions.Dissolve');

/**
 * Constructor
 * @return {ungravity.scenes.Credits}
 */
ungravity.scenes.Credits = function() {
    goog.base(this);
    this.layer = new lime.Layer();
    this.createLabels();
    this.appendChild(this.layer);
    goog.events.listen(this, ['mousedown', 'touchend'], this.clickHandler);
};

goog.inherits(ungravity.scenes.Credits, lime.Scene);

goog.object.extend(ungravity.scenes.Credits.prototype, {
    /**
     * The Credits scene layer
     * @type {lime.Layer}
     */
    layer: undefined,

    /**
     * Creates the labels for credits
     * @return {undefined} Nothing returned
     */
    createLabels: function() {
        var defaultLabelHeight = 40;
        var creditLines = [
            'Idea, Design & Programming: David Curras',
            'Graphics & Music: Renzo Gustavino'
        ];
        for(var i in creditLines){
            var line = creditLines[i];
            var xPos = ungravity.settings.width/2;
            var yPos = (ungravity.settings.height/2) - ((defaultLabelHeight/2)*creditLines.length) + (defaultLabelHeight*i);
            var label = new lime.Label()
                .setText(line)
                .setFontFamily('Verdana')
                .setFontSize(16)
                .setFontColor('#ffffff')
                .setAnchorPoint(0.5, 0.5)
                .setPosition(xPos, yPos);
            this.layer.appendChild(label);
        }
    },

    /**
     * On click replaces the Credits scene with the Menu scene
     * @return {undefined} Nothing returned
     */
    clickHandler: function() {
        ungravity.director.replaceScene(new ungravity.scenes.Menu(), lime.transitions.Dissolve);
    }
});