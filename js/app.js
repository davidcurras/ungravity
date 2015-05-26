'use strict';

window.onload = function () {
    //  Create Phaser game
    var game = new Phaser.Game(800, 480, Phaser.AUTO, 'game');
    //Add game states
    game.state.add('Boot', Ungravity.BootState);
    game.state.add('Preloader', Ungravity.LoaderState);
    game.state.add('Menu', Ungravity.MenuState);
    game.state.add('Game', Ungravity.GameState);
    game.state.add('Congratulations', Ungravity.Congratulations);
    game.state.add('GameOver', Ungravity.GameOver);
    //Start the Boot state.
    game.state.start('Boot');
};
