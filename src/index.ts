import type {
    GameProgressionType,
    GameModesType,
    GameMoveType,
    GCSType,
    GCSConstructorObjectType,
    GameLimitersType,
    GameRateLimiterType,
    GamePausesType,
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
    protected gameStartTime: Date | undefined;
    protected gameEndTime: Date | undefined;
    protected speed: number;
    protected movesMade?: number;
    protected options?: string[];
    protected isOptionsVisible?: boolean;
    protected gameHistory: GameMoveType[];
    protected scoreTimeLimit: Date | undefined;
    protected moveTimeLimit: Date | undefined;
    protected sRCP: number;
    protected mRCP: number;
    protected pauses: GamePausesType[];
    protected winCheckCallback: () => boolean;
    protected loseCheckCallback: () => boolean;
    protected gameStateCallback: () => any;
    protected gameStateProgressionCallback: () => void;

    constructor({
        progression,
        score = 0,
        limiters = {},
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
        this.gameStartTime = gameStartTime;
        this.gameEndTime = undefined;
        this.gameHistory = gameHistory;
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
        this.sRCP = 0;
        this.mRCP = 0;
        this.pauses = [];

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
        let isPauseable: boolean = this.hasStarted() && this.isRunning();
        const lastPause: GamePausesType | undefined =
            this.pauses[this.pauses.length - 1];

        if (lastPause)
            isPauseable = isPauseable && lastPause.unpausedAt !== undefined;

        if (isPauseable)
            this.pauses.push({
                pausedAt: new Date(),
                unpausedAt: undefined,
            });
    };

    unpauseGame: () => void = () => {
        const lastPause: GamePausesType | undefined =
            this.pauses[this.pauses.length - 1];
        let isUnpauseable: boolean =
            this.hasStarted() && !this.isRunning() && lastPause !== undefined;

        if (lastPause)
            isUnpauseable = isUnpauseable && lastPause.unpausedAt === undefined;

        if (isUnpauseable && lastPause) lastPause.unpausedAt = new Date();
    };

    isPaused: () => boolean = () => this.hasStarted() && !this.isRunning();

    progressGame: () => boolean = () => {
        if (
            !this.hasStarted ||
            !this.isRunning() ||
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
        let lastState: GameMoveType = {
            score: this.score,
            time: new Date(),
            moves: this.movesMade ?? 0,
            gameState: this.gameStateCallback(),
        };

        this.gameHistory.push(lastState);
        let sCompState: GameMoveType | undefined = this.gameHistory[this.sRCP];
        let mCompState: GameMoveType | undefined = this.gameHistory[this.mRCP];

        if (this.limiters.scoreRate && sCompState && this.scoreTimeLimit) {
            if (
                lastState.score >=
                sCompState.score + this.limiters.scoreRate.value
            ) {
                this.sRCP = this.gameHistory.length - 1;
                this.scoreTimeLimit = new Date(
                    this.limiters.scoreRate.unitTime + new Date().getTime()
                );
            }
        }

        if (this.limiters.moveRate && mCompState && this.moveTimeLimit) {
            if (
                lastState.moves >=
                mCompState.moves + this.limiters.moveRate.value
            ) {
                this.mRCP = this.gameHistory.length - 1;
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
        }
    };

    canProgress: () => boolean = () => {
        return (
            this.hasStarted() &&
            this.isRunning() &&
            !this.hasWon() &&
            !this.hasLost() &&
            this.isMoveLimitCompliant() &&
            this.isTimeLimitCompliant() &&
            this.isScoreRateCompliant() &&
            this.isMoveRateCompliant()
        );
    };

    hasGameEnded: () => boolean = () =>
        this.hasStarted() &&
        (this.winCheckCallback() || this.loseCheckCallback());

    isMoveLimitCompliant: () => boolean = () =>
        this.limiters.moveLimit && this.movesMade
            ? this.movesMade <= this.limiters.moveLimit
            : true;

    isTimeLimitCompliant: () => boolean = () =>
        this.limiters.timeLimit && this.timeElapsed()
            ? this.timeElapsed() <= this.limiters.timeLimit
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

    gameProgression: () => GameProgressionType = () => this.progression;

    currentScore: () => number = () => this.score;

    gameMode: () => GameModesType[] = () => this.mode;

    isTimeLimited: () => boolean = () => this.mode.includes("time-limit");

    isMoveLimited: () => boolean = () => this.mode.includes("move-limit");

    isScoreRateLimited: () => boolean = () => this.mode.includes("score-rate");

    isMoveRateLimited: () => boolean = () => this.mode.includes("move-rate");

    gameLimiters: () => GameLimitersType = () => this.limiters;

    gameTimeLimit: () => number | false = () =>
        this.limiters.timeLimit ?? false;

    gameMoveLimit: () => number | false = () =>
        this.limiters.moveLimit ?? false;

    gameScoreRateLimit: () => GameRateLimiterType | false = () =>
        this.limiters.scoreRate ?? false;

    gameMoveRateLimit: () => GameRateLimiterType | false = () =>
        this.limiters.moveRate ?? false;

    timeElapsed: () => number = () => {
        if (this.gameStartTime) {
            const upperLim: Date = this.gameEndTime ?? new Date();
            let timeElapsed: number =
                upperLim.getTime() - this.gameStartTime.getTime();

            for (let pause of this.pauses) {
                if (pause.unpausedAt) {
                    timeElapsed -=
                        pause.unpausedAt.getTime() - pause.pausedAt.getTime();
                } else {
                    timeElapsed -=
                        upperLim.getTime() - pause.pausedAt.getTime();
                }
            }

            return timeElapsed;
        }

        return 0;
    };

    isRunning: () => boolean = () => {
        const lastPause: GamePausesType | undefined =
            this.pauses[this.pauses.length - 1];
        let isRunning: boolean = this.hasStarted();

        if (lastPause !== undefined)
            isRunning = isRunning && lastPause.unpausedAt !== undefined;

        return isRunning;
    };

    hasStarted: () => boolean = () => this.gameStartTime !== undefined;

    getGameStartTime: () => Date | undefined = () => this.gameStartTime;

    getGameEndTime: () => Date | undefined = () => this.gameEndTime;

    getSpeed: () => number = () => this.speed;

    getMovesMade: () => number = () => this.movesMade ?? 0;

    getOptions: () => string[] = () => this.options ?? [];

    getIsOptionsVisible: () => boolean = () => this.isOptionsVisible ?? false;

    getGameHistory: () => GameMoveType[] = () => this.gameHistory;

    getScoreTimeLimit: () => Date | undefined = () => this.scoreTimeLimit;

    getMoveTimeLimit: () => Date | undefined = () => this.moveTimeLimit;

    // Object Setters

    updateScore: (val: number) => void = (val) => {
        this.score += val;
    };

    updateMoves: (val: number) => void = (val) => {
        this.movesMade ??= 0;
        this.movesMade += val;
    };

    updateLimiters: (updatedLimiters: GameLimitersType) => void = (
        updatedLimiters
    ) => {
        if (updatedLimiters.moveLimit && this.limiters.moveLimit)
            this.limiters.moveLimit = updatedLimiters.moveLimit;

        if (updatedLimiters.timeLimit && this.limiters.timeLimit)
            this.limiters.timeLimit = updatedLimiters.timeLimit;

        if (updatedLimiters.scoreRate && this.limiters.scoreRate)
            this.limiters.scoreRate = updatedLimiters.scoreRate;

        if (updatedLimiters.moveRate && this.limiters.moveRate)
            this.limiters.moveRate = updatedLimiters.moveRate;
    };
}

export default GCS;
