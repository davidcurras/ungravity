Ungravity.LoaderState = (function() {
    'use strict';

    function LoaderState(game) {
        var i, j, levelName;
        if (!(this instanceof LoaderState)) {
            return new LoaderState(game);
        }
        this.fixedText = null;
        this.loadingText = null;
        this.assets = {
            sprites: {
                'icons-clock': 'assets/icons/clock.png',
                'icons-clock': 'assets/icons/star.png',
                'maps-tileset': 'assets/maps/tileset.png',
                'texts-credits': 'assets/texts/credits.png',
                'texts-dcg': 'assets/texts/dcg.png',
                'texts-options': 'assets/texts/options.png',
                'texts-play': 'assets/texts/play.png',
                'texts-ungravity': 'assets/texts/ungravity.png',
                'tuts-tut101-goal': 'assets/tuts/tut101-goal.png',
                'tuts-tut101-click': 'assets/tuts/tut101-click.png',
                'tuts-tut101-tap': 'assets/tuts/tut101-tap.png',
                'tuts-tut104': 'assets/tuts/tut104-balls.png',
                'tuts-tut106': 'assets/tuts/tut106-redstar.png',
                'tuts-tut108': 'assets/tuts/tut108-time.png',
                'tuts-tut201': 'assets/tuts/tut201-redball.png',
                'tuts-tut204': 'assets/tuts/tut204-allstars.png'
            },
            maps: {}
        };
        //Adding maps and thumbnails to the loading list
        for (i = 1; i <= 2; i++) { // There are two episodes
            for (j = 1; j <= 9; j++) { //There are 9 levels per episode
                levelName = ''+i;
                if(j < 10){
                    levelName += '0';
                }
                levelName += j;
                this.assets.maps['maps-'+levelName] = 'assets/maps/map'+levelName+'.tmx';
                this.assets.sprites['thumbnails-'+levelName] = 'assets/thumbnails/level'+levelName+'.png';
                this.assets.sprites['thumbnails-'+levelName+'-locked'] = 'assets/thumbnails/level'+levelName+'-locked.png';
            }
            this.assets.sprites['thumbnails-'+i] = 'assets/thumbnails/episode'+i+'.png';
        }
    }

    LoaderState.prototype = {

        preload: function () {
            this.fixedText = this.add.text(this.game.world.centerX, 150, 'Cargando', { font: "40px Arial", fill: "#FFFFFF", align: "center" });
            this.fixedText.anchor.setTo(0.5, 0);
            this.loadingText = this.add.text(this.game.world.centerX, 210, '...', { font: "40px Arial", fill: "#FFFFFF", align: "center" });
            this.loadingText.anchor.setTo(0.5, 0);
            // Capture keys
            this.input.keyboard.addKeyCapture([
                Phaser.Keyboard.UP,
                Phaser.Keyboard.DOWN,
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT
            ]);
        },

        create: function () {
            var key;
            //set loader event handlers
            this.load.onFileComplete.add(this.updateProgress, this);
            this.load.onLoadComplete.add(this.loadComplete, this);
            // Load sprites
            for (key in this.assets.sprites) {
                if (this.assets.sprites.hasOwnProperty(key)) {
                    this.load.image(key, this.assets.sprites[key]);
                }
            };
            // Load maps
            for (key in this.assets.maps) {
                if (this.assets.maps.hasOwnProperty(key)) {
                    this.load.image(key, this.assets.maps[key]);
                }
            };
            this.load.start();
        },

        updateProgress: function (progress, cacheKey, success, totalLoaded, totalFiles) {
            this.loadingText.setText(progress + '% (' + totalLoaded + ' de ' + totalFiles + ')');
            if(!success) {
                console.error('Unable to load asset "'+cacheKey+'"');
            }
        },

        loadComplete: function () {
            //this.state.start('Menu');
            console.log('Complete');
        }
    };

    return LoaderState;
}());