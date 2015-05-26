var Cloud = (function() {
    'use strict';

    function Cloud(game, x, y, key, group) {
        if (!(this instanceof Cloud)) {
            return new Cloud(game, x, y, key, group);
        }
        if (typeof group === 'undefined') {
            group = game.world;
        }
        Phaser.Sprite.call(this, game, x, y, key);
        game.physics.arcade.enable(this);
        this.anchor.x = 0.5;
        this.body.customSeparateX = true;
        this.body.customSeparateY = true;
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.playerLocked = false;
        group.add(this);
    }

    Cloud.prototype = Object.create(Phaser.Sprite.prototype);

    Cloud.prototype.constructor = Cloud;

    Cloud.prototype.addMotionPath = function (motionPath) {
        this.tweenX = this.game.add.tween(this.body);
        this.tweenY = this.game.add.tween(this.body);
        //  motionPath is an array containing objects with this structure
        //  [
        //   { x: "+200", xSpeed: 2000, xEase: "Linear", y: "-200", ySpeed: 2000, yEase: "Sine.easeIn" }
        //  ]
        for (var i = 0; i < motionPath.length; i++) {
            this.tweenX.to( { x: motionPath[i].x }, motionPath[i].xSpeed, motionPath[i].xEase);
            this.tweenY.to( { y: motionPath[i].y }, motionPath[i].ySpeed, motionPath[i].yEase);
        }
        this.tweenX.loop();
        this.tweenY.loop();
    };

    Cloud.prototype.start = function () {
        this.tweenX.start();
        this.tweenY.start();
    };

    Cloud.prototype.stop = function () {
        this.tweenX.stop();
        this.tweenY.stop();
    };

    return Cloud;
}());



