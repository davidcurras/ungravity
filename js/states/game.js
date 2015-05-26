Ungravity.GameState = (function() {
    'use strict';

    function GameState(game) {
        if (!(this instanceof GameState)) {
            return new GameState(game);
        }

        /**
         * When a State is added to Phaser it automatically has the following properties set on it
         * even if they already exist, and do consider them as being 'reserved words':
            this.game        a reference to the currently running game
            this.add        used to add sprites, text, groups, etc
            this.camera        a reference to the game camera
            this.cache         the game cache
            this.input         the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
            this.load         for preloading assets
            this.math         lots of useful common math operations
            this.sound         the sound manager - add a sound, play one, set-up markers, etc
            this.stage         the game stage
            this.time         the clock
            this.tweens     the tween manager
            this.world         the game world
            this.particles     the particle manager
            this.physics     the physics manager
            this.rnd         he repeatable random number generator
        */

        this.debug = false;
        this.bg = null;
        this.trees = null;
        this.player = null;
        this.stationary = null;
        this.clouds = null;
        this.facing = 'left';
        this.jumpTimer = 0;
        this.cursors;
        this.locked = false;
        this.lockedTo = null;
        this.wasLocked = false;
        this.willJump = false;
    }

    GameState.prototype = {

        init: function () {
            this.game.renderer.renderSession.roundPixels = true;
            this.world.resize(640*3, 480);
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.physics.arcade.gravity.y = 600;
        },

        create: function () {
            this.background = this.add.tileSprite(0, 0, 640, 480, 'background');
            this.background.fixedToCamera = true;
            this.trees = this.add.tileSprite(0, 364, 640, 116, 'trees');
            this.trees.fixedToCamera = true;
            //  Platforms that don't move
            this.stationary = this.add.physicsGroup();
            this.stationary.create(0, 96, 'platform');
            this.stationary.create(632, 220, 'platform');
            this.stationary.create(1100, 300, 'platform');
            this.stationary.setAll('body.allowGravity', false);
            this.stationary.setAll('body.immovable', true);
            //  Platforms that move
            this.clouds = this.add.physicsGroup();
            var cloud1 = new Cloud(this.game, 300, 450, 'cloud-platform', this.clouds);
            cloud1.addMotionPath([
                { x: "+200", xSpeed: 2000, xEase: "Linear", y: "-200", ySpeed: 2000, yEase: "Sine.easeIn" },
                { x: "-200", xSpeed: 2000, xEase: "Linear", y: "-200", ySpeed: 2000, yEase: "Sine.easeOut" },
                { x: "-200", xSpeed: 2000, xEase: "Linear", y: "+200", ySpeed: 2000, yEase: "Sine.easeIn" },
                { x: "+200", xSpeed: 2000, xEase: "Linear", y: "+200", ySpeed: 2000, yEase: "Sine.easeOut" }
            ]);
            var cloud2 = new Cloud(this.game, 800, 96, 'cloud-platform', this.clouds);
            cloud2.addMotionPath([
                { x: "+0", xSpeed: 2000, xEase: "Linear", y: "+300", ySpeed: 2000, yEase: "Sine.easeIn" },
                { x: "-0", xSpeed: 2000, xEase: "Linear", y: "-300", ySpeed: 2000, yEase: "Sine.easeOut" }
            ]);
            var cloud3 = new Cloud(this.game, 1300, 290, 'cloud-platform', this.clouds);
            cloud3.addMotionPath([
                { x: "+500", xSpeed: 4000, xEase: "Expo.easeIn", y: "-200", ySpeed: 3000, yEase: "Linear" },
                { x: "-500", xSpeed: 4000, xEase: "Expo.easeOut", y: "+200", ySpeed: 3000, yEase: "Linear" }
            ]);
            //  The Player
            this.player = this.add.sprite(32, 0, 'dude');
            this.physics.arcade.enable(this.player);
            this.player.body.collideWorldBounds = true;
            this.player.body.setSize(20, 32, 5, 16);
            this.player.animations.add('left', [0, 1, 2, 3], 10, true);
            this.player.animations.add('turn', [4], 20, true);
            this.player.animations.add('right', [5, 6, 7, 8], 10, true);
            this.camera.follow(this.player);
            this.cursors = this.input.keyboard.createCursorKeys();
            this.clouds.callAll('start');
        },

        customSep: function (player, platform) {
            if (!this.locked && player.body.velocity.y > 0) {
                this.locked = true;
                this.lockedTo = platform;
                platform.playerLocked = true;
                player.body.velocity.y = 0;
            }
        },

        checkLock: function () {
            this.player.body.velocity.y = 0;
            //  If the player has walked off either side of the platform then they're no longer locked to it
            if (this.player.body.right < this.lockedTo.body.x || this.player.body.x > this.lockedTo.body.right) {
                this.cancelLock();
            }
        },

        cancelLock: function () {
            this.wasLocked = true;
            this.locked = false;
        },

        preRender: function () {
            if (this.game.paused) {
                //  Because preRender still runs even if your game pauses!
                return;
            }
            if (this.locked || this.wasLocked) {
                this.player.x += this.lockedTo.deltaX;
                this.player.y = this.lockedTo.y - 48;
                if (this.player.body.velocity.x !== 0) {
                    this.player.body.velocity.y = 0;
                }
            }
            if (this.willJump) {
                this.willJump = false;
                if (this.lockedTo && this.lockedTo.deltaY < 0 && this.wasLocked) {
                    //  If the platform is moving up we add its velocity to the players jump
                    this.player.body.velocity.y = -300 + (this.lockedTo.deltaY * 10);
                } else {
                    this.player.body.velocity.y = -300;
                }
                this.jumpTimer = this.time.time + 750;
            }
            if (this.wasLocked) {
                this.wasLocked = false;
                this.lockedTo.playerLocked = false;
                this.lockedTo = null;
            }
        },
        update: function () {
            this.background.tilePosition.x = -(this.camera.x * 0.7);
            this.trees.tilePosition.x = -(this.camera.x * 0.9);
            this.physics.arcade.collide(this.player, this.stationary);
            this.physics.arcade.collide(this.player, this.clouds, this.customSep, null, this);
            //  Do this AFTER the collide check, or we won't have blocked/touching set
            var standing = this.player.body.blocked.down || this.player.body.touching.down || this.locked;
            this.player.body.velocity.x = 0;
            if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -150;
                if (this.facing !== 'left') {
                    this.player.play('left');
                    this.facing = 'left';
                }
            } else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = 150;
                if (this.facing !== 'right') {
                    this.player.play('right');
                    this.facing = 'right';
                }
            } else {
                if (this.facing !== 'idle') {
                    this.player.animations.stop();
                    if (this.facing === 'left') {
                        this.player.frame = 0;
                    } else {
                        this.player.frame = 5;
                    }
                    this.facing = 'idle';
                }
            }
            if (standing && this.cursors.up.isDown && this.time.time > this.jumpTimer) {
                if (this.locked) {
                    this.cancelLock();
                }
                this.willJump = true;
            }
            if (this.locked) {
                this.checkLock();
            }

        }
    };

    return GameState;
}());
