goog.provide('ungravity.scenes.Options');

goog.require('lime');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Label');
goog.require('lime.transitions.Dissolve');

/**
 * Constructor
 * @return {ungravity.scenes.Options}
 */
ungravity.scenes.Options = function() {
    goog.base(this);
    this.layer = new lime.Layer();
    this.createLabels();
    this.appendChild(this.layer);
    goog.events.listen(this, ['mousedown', 'touchend'], this.clickHandler);
};

goog.inherits(ungravity.scenes.Options, lime.Scene);

goog.object.extend(ungravity.scenes.Options.prototype, {
    /**
     * The Options scene layer
     * @type {lime.Layer}
     */
    layer: undefined,

    /**
     * Creates the labels for options
     * @return {undefined} Nothing returned
     */
    createLabels: function() {
        var defaultLabelHeight = 40;
        var optionLines = [
            'Sounds',
            'Graphics',
            'Controls',
            'Back'
        ];
        for(var i in optionLines){
            var option = optionLines[i];
            var xPos = ungravity.settings.width/2;
            var yPos = (ungravity.settings.height/2) - ((defaultLabelHeight/2)*optionLines.length) + (defaultLabelHeight*i);
            var label = new lime.Label()
                .setText(option)
                .setFontFamily('Verdana')
                .setFontSize(16)
                .setFontColor('#ffffff')
                .setAnchorPoint(0.5, 0.5)
                .setPosition(xPos, yPos);
            this.layer.appendChild(label);
        }
    },

    /**
     * On click replaces the Options scene with the Menu scene
     * @return {undefined} Nothing returned
     */
    clickHandler: function() {
        ungravity.director.replaceScene(new ungravity.scenes.Menu(), lime.transitions.Dissolve);
    }
});