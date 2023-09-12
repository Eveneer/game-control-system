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
    score: number;
    mode: GameModesType[];
    movesMade?: number;
    moves?: GameMovesType<any>;
    options?: string[];
    isOptionsVisible?: boolean;
    speed?: number;
    isRunning: boolean;
    hasStarted: boolean;
    gameStartTime: string | Date | undefined;
    gameEndTime: string | Date | undefined;
}

export interface GameControlSystemFunctionsType {
    startGame: () => void;
    isPaused: () => boolean;
    pauseGame: () => void;
    unpauseGame: () => void;
    incrementScore: (val: number) => void;
    decrementScore: (val: number) => void;
}

class GameControlSystem implements GameControlSystemPropertiesType {
    score: number;
    mode: GameModesType[];
    isRunning: boolean;
    hasStarted: boolean;
    gameStartTime: string | Date | undefined;
    gameEndTime: string | Date | undefined;
    speed?: number;
    movesMade?: number;
    options?: string[];
    isOptionsVisible?: boolean;
    moves: GameMovesType<any>;

    constructor({
        score,
        mode,
        isRunning,
        hasStarted,
        gameStartTime,
        gameEndTime,
        speed,
        movesMade,
        options,
        isOptionsVisible,
        moves,
    }: GameControlSystemPropertiesType) {
        this.score = score;
        this.mode = mode;
        this.isRunning = isRunning;
        this.hasStarted = hasStarted;
        this.gameStartTime = gameStartTime;
        this.gameEndTime = gameEndTime;

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

        this.moves = moves ?? [];
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