import type { GCSType } from "./types";

export const gcsFunctionalitiesMixin: GCSType = {
    startGame: function () {
        this.isRunning = true;
        this.hasStarted = true;
        this.isOptionsVisible = false;
        this.gameStartTime = new Date();
        this.progressGame();
    },

    pauseGame: function () {
        if (!this.hasGameEnded() && this.isRunning) this.isRunning = false;
    },

    unpauseGame: function () {
        if (!this.hasGameEnded() && !this.isRunning) this.isRunning = true;
    },

    isPaused: function () {
        return this.hasStarted && !this.isRunning;
    },

    progressGame: function () {
        if (
            !this.hasStarted ||
            !this.isRunning ||
            this.loseCheckCallback() ||
            this.winCheckCallback() ||
            this.gameEndTime
        ) {
            this.endGame();
            return false;
        }

        this.gameStateProgressionCallback();
        this.recordState();

        return true;
    },

    recordState: function () {
        this.gameHistory.push({
            score: this.score,
            time: new Date(),
            moves: (this.movesMade ?? -1) + 1,
            gameState: this.gameStateCallback(),
        });
    },

    toggleOptionsVisibility: function () {
        this.isOptionsVisible = !this.isOptionsVisible;
    },

    endGame: function () {
        if (this.gameEndTime && this.hasGameEnded()) {
            this.gameEndTime = new Date();
            this.isRunning = false;
        }
    },

    hasGameEnded: function () {
        return (
            this.hasStarted &&
            (this.winCheckCallback() || this.loseCheckCallback())
        );
    },
};
