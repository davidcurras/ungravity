goog.provide('ungravity.scenes.Options');
goog.require('lime.Scene');

/**
 * @constructor
 * @extends {lime.Scene}
 * @return {ungravity.scenes.Options}
 */
ungravity.scenes.Options = function() {
    goog.base(this);
    this.layer = new lime.Layer();
    this.createLabels();
    this.appendChild(this.layer);
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
        var Lbl = ungravity.scenes.Options.Labels;
        for (var key in Lbl) {
            Lbl[key].label = new lime.Label()
                .setFontFamily('Permanent Marker')
                .setFontSize(30)
                .setFontColor('#FFF')
                .setAnchorPoint(0, 0);
            if(typeof Lbl[key].eventHandler !== 'undefined'){
                goog.events.listen(Lbl[key].label, ['mousedown', 'touchend'], Lbl[key].eventHandler);
            }
            this.layer.appendChild(Lbl[key].label);
        };
        Lbl.Options.label.setText('Options')
            .setFontSize(50)
            .setAnchorPoint(0.5, 0)
            .setPosition(ungravity.settings.width/2, 25);
        Lbl.Sound.label.setText('Sound')
            .setPosition(200, 130);
        var onOffText = ungravity.settings.isMuted ? 'Off' : 'On';
        Lbl.OnOff.label.setText(onOffText)
            .setFontFamily('Quantico')
            .setPosition(400, 130);
        Lbl.Graphics.label.setText('Graphics')
            .setPosition(200, 230);
        var canvasOnOffText = ungravity.settings.canvasRenderer ? 'Canvas Renderer' : 'HTML Elements Renderer';
        Lbl.CanvasOnOff.label.setText(canvasOnOffText)
            .setFontFamily('Quantico')
            .setPosition(400, 230);
        Lbl.Back.label.setText('Back')
            .setAnchorPoint(0.5, 0)
            .setPosition(ungravity.settings.width/2, 330);
    },

    /**
     * On click replaces the Options scene with the Menu scene
     * @return {undefined} Nothing returned
     */
    clickHandler: function() {
        ungravity.director.replaceScene(new ungravity.scenes.Menu(), lime.transitions.Dissolve);
    }
});

/**
 * The event handler for Sound option click
 * @return {undefined} Nothing returned
 */
ungravity.scenes.Options.ToggleSound = function(){ 
    var soundOnOff = ungravity.scenes.Options.Labels.OnOff;
    if(ungravity.settings.isMuted){
        soundOnOff.label.setText('On');
        lime.audio.setMute(false);
        ungravity.settings.isMuted = false;
    } else {
        soundOnOff.label.setText('Off');
        lime.audio.setMute(true);
        ungravity.settings.isMuted = true;
    }
};

/**
 * The event handler for Graphics option click
 * @return {undefined} Nothing returned
 */
ungravity.scenes.Options.ToggleGraphics = function(){
    var canvasOnOff = ungravity.scenes.Options.Labels.CanvasOnOff;
    if(ungravity.settings.canvasRenderer){
        canvasOnOff.label.setText('HTML Elements Renderer');
        ungravity.settings.canvasRenderer = false;
        goog.net.cookies.set('canv', '0');
    } else {
        canvasOnOff.label.setText('Canvas Renderer');
        ungravity.settings.canvasRenderer = true;
        goog.net.cookies.set('canv', '1');
    }
};

/**
 * A hash containing the option labels
 * @type {Object}
 */
ungravity.scenes.Options.Labels = {
    'Options': {'label':undefined , 'eventHandler':undefined},
    'Sound': {'label':undefined , 'eventHandler':undefined},
    'OnOff': {'label':undefined , 'eventHandler':ungravity.scenes.Options.ToggleSound},
    'Graphics': {'label':undefined , 'eventHandler':undefined},
    'CanvasOnOff': {'label':undefined , 'eventHandler':ungravity.scenes.Options.ToggleGraphics},
    'Back': {'label':undefined , 'eventHandler':function() {
        ungravity.director.replaceScene(new ungravity.scenes.Menu(), lime.transitions.Dissolve);
    }}
};