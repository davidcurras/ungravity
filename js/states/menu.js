Ungravity.MenuState = (function() {
    'use strict';

    function MenuState(game) {
        if (!(this instanceof MenuState)) {
            return new MenuState(game);
        }
        this.gameMessageText = null;
        this.gameMessageSecondLineText = null;
    }

    MenuState.prototype = {

        create: function () {
            this.gameMessageText = this.add.text(this.game.world.centerX, 180, 'Click para empezar', { font: "40px Arial", fill: "#FFFFFF", align: "center" });
            this.gameMessageText.anchor.setTo(0.5, 0);
            this.gameMessageText = this.add.text(this.game.world.centerX, 300, 'Utilizar las flechas', { font: "40px Arial", fill: "#FFFFFF", align: "center" });
            this.gameMessageText.anchor.setTo(0.5, 0);
            this.gameMessageSecondLineText = this.add.text(this.game.world.centerX, 350, 'para mover al jugador', { font: "40px Arial", fill: "#FFFFFF", align: "center" });
            this.gameMessageSecondLineText.anchor.setTo(0.5, 0);
            this.game.input.onDown.add(this.click, this);
        },

        click: function(x, y, timedown) {
            //this.music.stop();
            this.state.start('Game');
        }
    };

    return MenuState;
}());
