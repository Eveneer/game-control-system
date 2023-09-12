import type {
    GameProgressionType,
    GameModesType,
    GameMoveType,
    GameControlSystemPropertiesType,
    GameControlSystemFunctionsType,
    GameControlSystemType,
} from "./types.ts";

class GameControlSystem implements GameControlSystemType {
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
    moves: GameMoveType[];
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
