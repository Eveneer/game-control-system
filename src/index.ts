import type {
    GameProgressionType,
    GameModesType,
    GameMoveType,
    GCSType,
    GCSConstructorObjectType,
} from "./types.ts";

class GCS implements GCSType {
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
        gameStartTime,
        speed,
        movesMade,
        options,
        isOptionsVisible,
        gameHistory,
        winCheckCallback,
        loseCheckCallback,
        gameStateCallback,
        gameStateProgressionCallback,
    }: GCSConstructorObjectType) {
        this.progression = progression;
        this.score = score ?? 0;
        this.mode = mode;
        this.isRunning = false;
        this.hasStarted = false;
        this.gameStartTime = gameStartTime;
        this.gameEndTime = undefined;
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

    progressGame: () => boolean = () => {
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
    };

    recordState: () => void = () => {
        this.gameHistory.push({
            score: this.score,
            time: new Date(),
            moves: this.movesMade ?? 0,
            gameState: this.gameStateCallback(),
        });
    };

    toggleOptionsVisibility: () => void = () => {
        this.isOptionsVisible = !this.isOptionsVisible;
    };

    endGame: () => void = () => {
        if (this.gameEndTime) {
            this.gameEndTime = new Date();
            this.isRunning = false;
        }
    };
}

export default GCS;
