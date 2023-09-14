import type { GCSGetterFuncstionsType } from "./types";

export const gcsSettersMixin: GCSGetterFuncstionsType = {
    getProgression: function () {
        return this.progression;
    },

    getScore: function () {
        return this.score;
    },

    getMode: function () {
        return this.mode;
    },

    getLimiters: function () {
        return this.limiters;
    },

    getTimeElapsed: function () {
        return this.timeElapsed;
    },

    getIsRunning: function () {
        return this.isRunning;
    },

    getHasStarted: function () {
        return this.hasStarted;
    },

    getGameStartTime: function () {
        return this.gameStartTime;
    },

    getGameEndTime: function () {
        return this.gameEndTime;
    },

    getSpeed: function () {
        return this.speed;
    },

    getMovesMade: function () {
        return this.movesMade;
    },

    getOptions: function () {
        return this.options;
    },

    getIsOptionsVisible: function () {
        return this.isOptionsVisible;
    },

    getGameHistory: function () {
        return this.gameHistory;
    },
};
