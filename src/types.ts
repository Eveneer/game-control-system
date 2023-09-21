export type GameProgressionType = "time-based" | "move-based";

export type GameModesType =
    | "time-limit" // A game mode where the game ends after a limited amount of time
    | "move-limit" // A game mode where the game ends after a limited number of moves
    | "score-rate" // A game mode where a score rate has to be maintained (scores per unit time)
    | "move-rate"; // A game mode where a move rate has to be maintained (moves per unit time)

export interface GameRateLimiterType {
    value: number;
    unitTime: number;
}

export interface GameMoveType {
    score: number;
    moves: number;
    time: Date;
    gameState: any;
}

export interface GameLimitersType {
    timeLimit?: number;
    moveLimit?: number;
    scoreRate?: GameRateLimiterType;
    moveRate?: GameRateLimiterType;
}

export interface GamePausesType {
    pausedAt: Date;
    unpausedAt: Date | undefined;
}

export interface GCSPropertiesType {
    progression: GameProgressionType;
    score: number;
    limiters: GameLimitersType;
    mode: GameModesType[];
    timeElapsed: number;
    movesMade?: number;
    gameHistory: GameMoveType[];
    options?: string[];
    isOptionsVisible?: boolean;
    speed: number;
    isRunning: boolean;
    hasStarted: boolean;
    gameStartTime: Date | undefined;
    gameEndTime: Date | undefined;
    scoreTimeLimit: Date | undefined;
    sRCP: number;
    mRCP: number;
    moveTimeLimit: Date | undefined;
    winCheckCallback: () => boolean;
    loseCheckCallback: () => boolean;
    gameStateCallback: () => any;
    gameStateProgressionCallback: () => void;
}

export interface GCSFunctionsType {
    startGame: () => void;
    pauseGame: () => void;
    unpauseGame: () => void;
    endGame: () => void;
    updateScoreBy: (val: number) => void;
    updateMovesBy: (val: number) => void;
    updateSpeed: (speed: number) => void;
    updateLimiters: (updatedLimiters: GameLimitersType) => void;
    isPaused: () => boolean;
    progressGame: () => boolean;
    recordState: () => void;
    toggleOptionsVisibility: () => void;
    hasGameEnded: () => boolean;
    isMoveLimitCompliant: () => boolean;
    isTimeLimitCompliant: () => boolean;
    isScoreRateCompliant: () => boolean;
    isMoveRateCompliant: () => boolean;
    hasWon: () => boolean;
    hasLost: () => boolean;
}

export interface GCSGetterFuncstionsType {
    gameProgression: () => GameProgressionType;
    currentScore: () => number;
    gameMode: () => GameModesType[];
    isTimeLimited: () => boolean;
    isMoveLimited: () => boolean;
    isScoreRateLimited: () => boolean;
    isMoveRateLimited: () => boolean;
    gameLimiters: () => GameLimitersType;
    gameTimeLimit: () => number | false;
    gameMoveLimit: () => number | false;
    gameScoreRateLimit: () => GameRateLimiterType | false;
    gameMoveRateLimit: () => GameRateLimiterType | false;
    timeElapsed: () => number;
    isRunning: () => boolean;
    hasStarted: () => boolean;
    getGameStartTime: () => Date | undefined;
    getGameEndTime: () => Date | undefined;
    getSpeed: () => number;
    getMovesMade: () => number;
    getOptions: () => string[];
    getIsOptionsVisible: () => boolean;
    getGameHistory: () => GameMoveType[];
    getScoreTimeLimit: () => Date | undefined;
    getMoveTimeLimit: () => Date | undefined;
    getPauses: () => GamePausesType[];
}

export interface GCSConstructorObjectType {
    progression: GameProgressionType;
    pauses?: GamePausesType[];
    score?: number;
    limiters?: GameLimitersType;
    movesMade?: number;
    gameHistory?: GameMoveType[];
    options?: string[];
    isOptionsVisible?: boolean;
    speed?: number;
    gameStartTime?: Date | undefined;
    winCheckCallback: () => boolean;
    loseCheckCallback: () => boolean;
    gameStateCallback: () => any;
    gameStateProgressionCallback: () => void;
}

export interface GCSType extends GCSFunctionsType, GCSGetterFuncstionsType {}
