export type GameProgressionType = "time-based" | "move-based";

export type GameModesType =
    | "time-limit" // A game mode where the game ends after a limited amount of time
    | "move-limit" // A game mode where the game ends after a limited numer of moves
    | "score-rate" // A game mode where a score rate has to be maintained (scores per unit time)
    | "move-rate"; // A game mode where a move rate has to be maintained (moves per unit time)

export interface GameMoveType {
    score: number;
    moves: number;
    gameState: any;
}

export interface GameControlSystemPropertiesType {
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

export interface GameControlSystemFunctionsType {
    startGame: () => void;
    pauseGame: () => void;
    unpauseGame: () => void;
    endGame: () => void;
    // incrementScore: (val: number) => void;
    // decrementScore: (val: number) => void;
    isPaused: () => boolean;
    progressGame: () => void;
    recordState: () => void;
    toggleOptionsVisibility: () => void;
}

export interface GameControlSystemType
    extends GameControlSystemPropertiesType,
        GameControlSystemFunctionsType {}
