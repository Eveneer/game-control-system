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

export interface GCSPropertiesType {
    progression: GameProgressionType;
    score: number;
    mode: GameModesType[];
    timeElapsed: number;
    movesMade?: number;
    gameHistory?: GameMoveType[];
    options?: string[];
    isOptionsVisible?: boolean;
    speed: number;
    isRunning: boolean;
    hasStarted: boolean;
    gameStartTime: string | Date | undefined;
    gameEndTime: string | Date | undefined;
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
}

export interface GCSConstructorObjectType {
    progression: GameProgressionType;
    mode: GameModesType[];
    score?: number;
    timeElapsed?: number;
    movesMade?: number;
    gameHistory?: GameMoveType[];
    options?: string[];
    isOptionsVisible?: boolean;
    speed?: number;
    gameStartTime?: string | Date | undefined;
    winCheckCallback: () => boolean;
    loseCheckCallback: () => boolean;
    gameStateCallback: () => any;
    gameStateProgressionCallback: () => void;
}

export interface GCSType extends GCSPropertiesType, GCSFunctionsType {}
