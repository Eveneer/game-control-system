import type {
    GameProgressionType,
    GameModesType,
    GameMoveType,
    GCSType,
    GCSConstructorObjectType,
    GameLimitersType,
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
        this.winCheckCallback = winCheckCallback;
        this.loseCheckCallback = loseCheckCallback;
        this.gameStateCallback = gameStateCallback;
        this.gameStateProgressionCallback = gameStateProgressionCallback;
        this.limiters = limiters;
        this.isOptionsVisible = isOptionsVisible;
        let mode: GameModesType[] = [];

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

    hasGameEnded: () => boolean = () =>
        this.hasStarted &&
        (this.winCheckCallback() || this.loseCheckCallback());

    // Object getters
    getProgression: () => GameProgressionType = () => this.progression;
    getScore: () => number = () => this.score;
    getMode: () => GameModesType[] = () => this.mode;
    getLimiters: () => GameLimitersType = () => this.limiters;
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
}

export default GCS;
