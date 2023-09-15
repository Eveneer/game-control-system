export type GameProgressionType = "time-based" | "move-based";

export type GameModesType =
    | "time-limit" // A game mode where the game ends after a limited amount of time
    | "move-limit" // A game mode where the game ends after a limited number of moves
    | "score-rate" // A game mode where a score rate has to be maintained (scores per unit time)
    | "move-rate"; // A game mode where a move rate has to be maintained (moves per unit time)

export interface GameMoveType {
    score: number;
    moves: number;
    time: Date;
    gameState: any;
}

export interface GameLimitersType {
    timeLimit?: number;
    moveLimit?: number;
    scoreRate?: number;
    moveRate?: number;
}

export interface GCSPropertiesType {
    progression: GameProgressionType;
    score: number;
    limiters: GameLimitersType;
    mode: GameModesType[];
    timeElapsed: number;
    movesMade?: number;
    gameHistory?: GameMoveType[];
    options?: string[];
    isOptionsVisible?: boolean;
    speed: number;
    isRunning: boolean;
    hasStarted: boolean;
    gameStartTime: Date | undefined;
    gameEndTime: Date | undefined;
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
    // incrementScore: (val: number) => void;
    // decrementScore: (val: number) => void;
    isPaused: () => boolean;
    progressGame: () => boolean;
    recordState: () => void;
    toggleOptionsVisibility: () => void;
    hasGameEnded: () => boolean;
}

export interface GCSGetterFuncstionsType {
    getProgression: () => GameProgressionType;
    getScore: () => number;
    getMode: () => GameModesType[];
    getLimiters: () => GameLimitersType;
    getTimeElapsed: () => number;
    getIsRunning: () => boolean;
    getHasStarted: () => boolean;
    getGameStartTime: () => Date | undefined;
    getGameEndTime: () => Date | undefined;
    getSpeed: () => number;
    getMovesMade: () => number;
    getOptions: () => string[];
    getIsOptionsVisible: () => boolean;
    getGameHistory: () => GameMoveType[];
}

export interface GCSConstructorObjectType {
    progression: GameProgressionType;
    score?: number;
    limiters: GameLimitersType;
    timeElapsed?: number;
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
