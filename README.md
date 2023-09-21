# Game Control System

The `game-control-system` package is a TypeScript library that provides a versatile game control system for managing game states, scoring, and options. It is designed to simplify game development by handling essential game control features, such as recording game states, maintaining start, end, and pause states, tracking game scores, and managing game options.

## Installation

You can install the `game-control-system` package using npm or yarn:

```bash
npm install game-control-system
```

## Usage

To use the control system in a game, you must first instantiate an object of the `GCS` class with `GCSConstructorObjectType` object as the param.

-   [How to instantiate `GCS`](Instantiation%20Instructions.md)
-   [Available getter functions](Getter%20Functions.md)

```ts
import GCS from "game-control-system/dist";

const yourFunctionToCheckIfPlayerLost: () => boolean = () => {
    // Lose check logic
};

const yourFunctionToCheckIfPlayerWon: () => boolean = () => {
    // Win check logic
};

// This function will be called from gsc.progressGame(), so do not progress the game here
const yourFunctionToReturnGameState: () => any = () => gameState;

// This is the function where most of your game logic will exist/called from
const yourFunctionToProgressTheGameState: () => void = () => {
    // Logic to progress game state

    // If you need to increase/decrease the score, call gcs.updateScoreBy(value)
    gcs.updateScoreBy(10);

    // If you need to increase/decrease the number of moves made, call gcs.updateMovesBy(value)
    gcs.updateMovesBy(10);

    // If you want to change the limiters, call gcs.updateLimiters(newLimiters: GameLimitersType)
    gcs.updateLimiters(newLimiters);

    // Call progressGame() at the end of the function after progressing the state
    gcs.progressGame();
};

const gcs: GCS = new GCS({
    progression: "time-based",
    winCheckCallback: yourFunctionToCheckIfPlayerWon,
    loseCheckCallback: yourFunctionToCheckIfPlayerLost,
    gameStateCallback: yourFunctionToReturnGameState,
    gameStateProgressionCallback: yourFunctionToProgressTheGameState,
});
```

-   Start Game: `gcs.startGame()`
-   End Game: `gcs.endGame()`
-   Pause Game: `gcs.pauseGame()`
-   Unpause Game: `gcs.unpauseGame()`
-   Toggle Options Visibility `gcs.toggleOptionsVisibility()`
