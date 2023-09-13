import type {
    GameProgressionType,
    GameModesType,
    GameMoveType,
    GameControlSystemPropertiesType,
    GameControlSystemType,
} from "./types.ts";

class GameControlSystem implements GameControlSystemType {
    progression: GameProgressionType;
    score: number;
    mode: GameModesType[];
    timeElapsed: number;
    isRunning: boolean;
    hasStarted: boolean;
    gameStartTime: string | Date | undefined;
    gameEndTime: string | Date | undefined;
    speed: number;
    movesMade?: number;
    options?: string[];
    isOptionsVisible?: boolean;
    gameHistory: GameMoveType[];
    winCheckCallback: () => boolean;
    loseCheckCallback: () => boolean;
    gameStateCallback: () => any;
    gameStateProgressionCallback: () => void;

    constructor({
        progression,
        score,
        mode,
        timeElapsed,
        isRunning,
        hasStarted,
        gameStartTime,
        gameEndTime,
        speed,
        movesMade,
        options,
        isOptionsVisible,
        gameHistory,
        winCheckCallback,
        loseCheckCallback,
        gameStateCallback,
        gameStateProgressionCallback,
    }: GameControlSystemPropertiesType) {
        this.progression = progression;
        this.score = score;
        this.mode = mode;
        this.isRunning = isRunning;
        this.hasStarted = hasStarted;
        this.gameStartTime = gameStartTime;
        this.gameEndTime = gameEndTime;
        this.gameHistory = gameHistory ?? [];
        this.timeElapsed = timeElapsed ?? 0;
        this.speed = speed ?? 0;
        this.winCheckCallback = winCheckCallback ?? (() => false);
        this.loseCheckCallback = loseCheckCallback;
        this.gameStateCallback = gameStateCallback;
        this.gameStateProgressionCallback = gameStateProgressionCallback;

        if (this.progression === "time-based" && !speed)
            throw new Error(
                "Speed must be pass when game progression is time based"
            );

        if (options) {
            this.options = options;
            this.isOptionsVisible = isOptionsVisible ?? false;
        }

        if (isOptionsVisible) {
            this.isOptionsVisible = isOptionsVisible;
        }

        if (movesMade) {
            this.movesMade = movesMade;
        }
    }

    startGame: () => void = () => {
        this.isRunning = true;
        this.hasStarted = true;
        this.isOptionsVisible = false;
        this.gameStartTime = new Date();
        this.progressGame();
    };

    pauseGame: () => void = () => {
        if (this.hasStarted) {
            this.isRunning = false;
        }
    };

    unpauseGame: () => void = () => {
        if (this.hasStarted) {
            this.isRunning = true;
        }
    };

    isPaused: () => boolean = () => this.hasStarted && !this.isRunning;

    progressGame: () => void = () => {
        this.recordState();

        if (
            !this.hasStarted ||
            !this.isRunning ||
            this.loseCheckCallback() ||
            this.winCheckCallback() ||
            this.gameEndTime
        ) {
            this.endGame();
            return;
        }

        this.gameStateProgressionCallback();

        if (this.progression === "time-based") {
            this.timeElapsed += this.speed;
            setTimeout(() => {
                this.progressGame();
            }, this.speed);
        }
    };

    recordState: () => void = () => {
        this.gameHistory.push({
            score: this.score,
            moves: this.movesMade ?? 0,
            gameState: this.gameStateCallback(),
        });
    };

    toggleOptionsVisibility: () => void = () => {
        this.isOptionsVisible = !this.isOptionsVisible;
    };

    endGame: () => void = () => {
        if (this.gameEndTime) {
            this.gameEndTime = new Date;
            this.isRunning = false;
        }
    };
}

export default GameControlSystem;
