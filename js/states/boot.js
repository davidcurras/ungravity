'use strict';

var Ungravity = {};

Ungravity.BootState = (function() {

    function BootState(game) {
        if (!(this instanceof BootState)) {
            return new BootState(game);
        }
    }

    BootState.prototype = {
        preload: function () {
            this.load.image('ball', 'assets/sprites/ballanim.png');
        },

        create: function () {
            // Not multi-touch
            this.input.maxPointers = 1;
            // Scale game size
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.maxWidth = (window.innerHeight * 800) / 480;
            this.scale.maxHeight = window.innerHeight;
            this.scale.setScreenSize(true);
            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
            // Set arcade physics
            this.physics.startSystem(Phaser.Physics.ARCADE);
            // Load next state
            this.state.start('Preloader');
        }
    };

    return BootState;
}());
