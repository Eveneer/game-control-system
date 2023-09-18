import type {
    GameProgressionType,
    GameModesType,
    GameMoveType,
    GCSType,
    GCSConstructorObjectType,
    GameLimitersType,
    GameRateLimiterType,
} from "./types";

const gameLimiters: any = {
    timeLimit: "time-limit",
    moveLimit: "move-limit",
    scoreRate: "score-rate",
    moveRate: "move-rate",
};

class GCS implements GCSType {
    protected progression: GameProgressionType;
    protected score: number;
    protected mode: GameModesType[];
    protected limiters: GameLimitersType;
    protected timeElapsed: number;
    protected isRunning: boolean;
    protected hasStarted: boolean;
    protected gameStartTime: Date | undefined;
    protected gameEndTime: Date | undefined;
    protected speed: number;
    protected movesMade?: number;
    protected options?: string[];
    protected isOptionsVisible?: boolean;
    protected gameHistory: GameMoveType[];
    protected scoreTimeLimit: Date | undefined;
    protected moveTimeLimit: Date | undefined;
    protected scoreRateComparisonPoint: number;
    protected moveRateComparisonPoint: number;
    protected winCheckCallback: () => boolean;
    protected loseCheckCallback: () => boolean;
    protected gameStateCallback: () => any;
    protected gameStateProgressionCallback: () => void;

    constructor({
        progression,
        score = 0,
        limiters = {},
        timeElapsed = 0,
        gameStartTime,
        speed = 0,
        movesMade,
        options,
        isOptionsVisible = false,
        gameHistory = [],
        winCheckCallback = () => false,
        loseCheckCallback,
        gameStateCallback,
        gameStateProgressionCallback,
    }: GCSConstructorObjectType) {
        this.progression = progression;
        this.score = score;
        this.isRunning = false;
        this.hasStarted = false;
        this.gameStartTime = gameStartTime;
        this.gameEndTime = undefined;
        this.gameHistory = gameHistory;
        this.timeElapsed = timeElapsed;
        this.speed = speed;
        this.scoreTimeLimit = undefined;
        this.moveTimeLimit = undefined;
        this.winCheckCallback = winCheckCallback;
        this.loseCheckCallback = loseCheckCallback;
        this.gameStateCallback = gameStateCallback;
        this.gameStateProgressionCallback = gameStateProgressionCallback;
        this.limiters = limiters;
        this.isOptionsVisible = isOptionsVisible;
        let mode: GameModesType[] = [];
        this.scoreRateComparisonPoint = 0;
        this.moveRateComparisonPoint = 0;

        if (this.progression === "time-based" && !speed)
            throw new Error(
                "Speed must be pass when game progression is time based"
            );

        if (options) {
            this.options = options;
        }

        if (movesMade) {
            this.movesMade = movesMade;
        }

        Object.keys(limiters).forEach((limiter) => {
            mode.push(gameLimiters[limiter]);
        });

        this.mode = mode;
    }

    startGame: () => void = () => {
        this.isRunning = true;
        this.hasStarted = true;
        this.isOptionsVisible = false;
        this.gameStartTime = new Date();

        if (this.limiters.scoreRate)
            this.scoreTimeLimit = new Date(
                this.gameStartTime.getTime() + this.limiters.scoreRate?.unitTime
            );

        if (this.limiters.moveRate)
            this.scoreTimeLimit = new Date(
                this.gameStartTime.getTime() + this.limiters.moveRate?.unitTime
            );

        this.recordState();
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

        let lastState: GameMoveType | undefined = this.getLastGameState();
        let scoreCompareState: GameMoveType | undefined =
            this.gameHistory[this.scoreRateComparisonPoint];
        let moveCompareState: GameMoveType | undefined =
            this.gameHistory[this.moveRateComparisonPoint];

        if (
            this.limiters.scoreRate &&
            lastState &&
            scoreCompareState &&
            this.scoreTimeLimit
        ) {
            if (
                lastState.score >=
                scoreCompareState.score + this.limiters.scoreRate.value
            ) {
                this.scoreRateComparisonPoint = this.gameHistory.length - 1;
                this.scoreTimeLimit = new Date(
                    this.limiters.scoreRate.unitTime + new Date().getTime()
                );
            }
        }

        if (
            this.limiters.moveRate &&
            lastState &&
            moveCompareState &&
            this.moveTimeLimit
        ) {
            if (
                lastState.moves >=
                moveCompareState.moves + this.limiters.moveRate.value
            ) {
                this.moveRateComparisonPoint = this.gameHistory.length - 1;
                this.moveTimeLimit = new Date(
                    this.limiters.moveRate.unitTime + new Date().getTime()
                );
            }
        }
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

    canProgress: () => boolean = () => {
        return (
            this.hasStarted &&
            this.isRunning &&
            !this.hasWon() &&
            !this.hasLost() &&
            this.isMoveLimitCompliant() &&
            this.isTimeLimitCompliant() &&
            this.isScoreRateCompliant() &&
            this.isMoveRateCompliant()
        );
    };

    hasGameEnded: () => boolean = () =>
        this.hasStarted &&
        (this.winCheckCallback() || this.loseCheckCallback());

    isMoveLimitCompliant: () => boolean = () =>
        this.limiters.moveLimit && this.movesMade
            ? this.movesMade <= this.limiters.moveLimit
            : true;

    isTimeLimitCompliant: () => boolean = () =>
        this.limiters.timeLimit && this.timeElapsed
            ? this.timeElapsed <= this.limiters.timeLimit
            : true;

    isScoreRateCompliant: () => boolean = () =>
        this.scoreTimeLimit ? this.scoreTimeLimit >= new Date() : true;

    isMoveRateCompliant: () => boolean = () =>
        this.moveTimeLimit ? this.moveTimeLimit >= new Date() : true;

    hasWon: () => boolean = () =>
        this.winCheckCallback() &&
        this.isMoveLimitCompliant() &&
        this.isTimeLimitCompliant() &&
        this.isScoreRateCompliant() &&
        this.isMoveRateCompliant();

    hasLost: () => boolean = () => false;

    // Object getters
    getProgression: () => GameProgressionType = () => this.progression;

    getScore: () => number = () => this.score;

    getMode: () => GameModesType[] = () => this.mode;

    getIsTimeLimited: () => boolean = () => this.mode.includes("time-limit");

    getIsMoveLimited: () => boolean = () => this.mode.includes("move-limit");

    getIsScoreRateLimited: () => boolean = () =>
        this.mode.includes("score-rate");

    getIsMoveRateLimited: () => boolean = () => this.mode.includes("move-rate");

    getLimiters: () => GameLimitersType = () => this.limiters;

    getTimeLimit: () => number | false = () => this.limiters.timeLimit ?? false;

    getMoveLimit: () => number | false = () => this.limiters.moveLimit ?? false;

    getScoreRateLimit: () => GameRateLimiterType | false = () =>
        this.limiters.scoreRate ?? false;

    getMoveRateLimit: () => GameRateLimiterType | false = () =>
        this.limiters.moveRate ?? false;

    getTimeElapsed: () => number = () => this.timeElapsed;

    getIsRunning: () => boolean = () => this.isRunning;

    getHasStarted: () => boolean = () => this.hasStarted;

    getGameStartTime: () => Date | undefined = () => this.gameStartTime;

    getGameEndTime: () => Date | undefined = () => this.gameEndTime;

    getSpeed: () => number = () => this.speed;

    getMovesMade: () => number = () => this.movesMade ?? 0;

    getOptions: () => string[] = () => this.options ?? [];

    getIsOptionsVisible: () => boolean = () => this.isOptionsVisible ?? false;

    getGameHistory: () => GameMoveType[] = () => this.gameHistory;

    getLastGameState: () => GameMoveType | undefined = () =>
        this.gameHistory[this.gameHistory.length - 1];
}

export default GCS;
