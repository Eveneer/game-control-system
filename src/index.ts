export type GameProgressionType = "time-based" | "move-based";

export type GameModesType =
    | "time-limit" // A game mode where the game ends after a limited amount of time
    | "move-limit" // A game mode where the game ends after a limited numer of moves
    | "score-rate" // A game mode where a score rate has to be maintained (scores per unit time)
    | "move-rate"; // A game mode where a move rate has to be maintained (moves per unit time)

export type GameMovesType<T> = Array<T>;

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
    moves?: GameMovesType<any>;
    options?: string[];
    isOptionsVisible?: boolean;
    speed?: number;
    isRunning: boolean;
    hasStarted: boolean;
    gameStartTime: string | Date | undefined;
    gameEndTime: string | Date | undefined;
    winCheckCallback?: () => boolean;
    loseCheckCallback: () => boolean;
}

export interface GameControlSystemFunctionsType {
    startGame: () => void;
    pauseGame: () => void;
    unpauseGame: () => void;
    endGame: () => void;
    incrementScore: (val: number) => void;
    decrementScore: (val: number) => void;
    isPaused: () => boolean;
    hasWon: () => boolean;
    hasLost: () => boolean;
    progressGame: () => void;
    recordMove: () => void;
    toggleOptionsVisibility: () => void;
}

class GameControlSystem implements GameControlSystemPropertiesType {
    progression: GameProgressionType;
    score: number;
    mode: GameModesType[];
    timeElapsed: number;
    isRunning: boolean;
    hasStarted: boolean;
    gameStartTime: string | Date | undefined;
    gameEndTime: string | Date | undefined;
    speed?: number;
    movesMade?: number;
    options?: string[];
    isOptionsVisible?: boolean;
    moves: GameMovesType<any>;
    winCheckCallback?: () => boolean;
    loseCheckCallback: () => boolean;

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
        moves,
        winCheckCallback,
        loseCheckCallback,
    }: GameControlSystemPropertiesType) {
        this.progression = progression;
        this.score = score;
        this.mode = mode;
        this.isRunning = isRunning;
        this.hasStarted = hasStarted;
        this.gameStartTime = gameStartTime;
        this.gameEndTime = gameEndTime;
        this.moves = moves ?? [];
        this.timeElapsed = timeElapsed ?? 0;
        this.winCheckCallback = winCheckCallback ?? (() => false);
        this.loseCheckCallback = loseCheckCallback;

        if (speed) {
            this.speed = speed;
        }

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

    isPaused: () => boolean = () => this.hasStarted && !this.isRunning;

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
}

export default GameControlSystem;
