goog.provide('ungravity.entities.Player');

/**
 * Constructor
 * @return {ungravity.entities.Player}
 */
ungravity.entities.Player = function() {
    for(var i = 1; i <= ungravity.settings.episodes; i++){
        var episodeName = ''+i;
        for(var j = 1; j <= ungravity.settings.levelsPerEpisode; j++){
            levelName = episodeName;
            if(j < 10){
                levelName += '0';
            }
            levelName += j;
            this.gamePoints[levelName] = undefined;
        }
    }
    this.gamePoints['101'] = 0;
};

goog.object.extend(ungravity.entities.Player.prototype, {

    /**
     * The player points for each level of the whole game
     * @type {Object}
     */
    gamePoints: { },

    /**
     * The level that is currently playing
     * @type {Number}
     */
    levelName: undefined,

    /**
     * The stars collected in the current level
     * @type {Number}
     */
    stars: 0,

    /**
     * Returns the player total points
     * @return {[type]} [description]
     */
    getTotalPoints: function() {
        var total = 0;
        for (var key in this.gamePoints) {
            if (isNaN(parseInt(this.gamePoints[key]))) {
                continue;
            }
            total += parseInt(this.gamePoints[key]);
        };
        return total;
    }
});