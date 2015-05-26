Ungravity.WinState = (function() {
    'use strict';

    function WinState(game) {
        if (!(this instanceof WinState)) {
            return new WinState(game);
        }
        this.music = null;
        this.logo = null;
        this.playButton = null;
        this.gameMessageText = null;
        this.gameMessageSecondLineText = null;
        this.gameMessageInfoText = null;
    }

    WinState.prototype = {

        create: function () {
            this.game.add.sprite(0, 0, 'bg');
            //this.music = this.add.audio('titleMusic');
            //this.music.play();
            this.logo = this.add.sprite(this.game.world.centerX, 140, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            this.gameMessageText = this.add.text(this.game.world.centerX, 280, 'CONGRATULATIONS !!!', { font: "20px Arial", fill: "#000000", align: "center" });
            this.gameMessageText.anchor.setTo(0.5, 0);
            this.gameMessageText = this.add.text(this.game.world.centerX, 320, 'A winner is you!', { font: "20px Arial", fill: "#000000", align: "center" });
            this.gameMessageText.anchor.setTo(0.5, 0);
            this.game.input.onDown.add(this.click, this);
        },

        click: function(x, y, timedown) {
            //this.music.stop();
            this.game.state.start('MainMenu');
        }
    };

    return WinState;
}());
