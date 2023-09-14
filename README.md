# Game Control System

The `game-control-system` package is a TypeScript library that provides a versatile game control system for managing game states, scoring, and options. It is designed to simplify game development by handling essential game control features, such as recording game states, maintaining start, end, and pause states, tracking game scores, and managing game options.

## Installation

You can install the `game-control-system` package using npm or yarn:

```bash
npm install game-control-system

# or

yarn add game-control-system
```

## Usage

To use the control system in a game, you must first instantiate an object of the `GCS` class with `GCSConstructorObjectType` object as the param.
The `GCSConstructorObjectType` has the following keys:

-   `progression: "time-based" | "move-based"`

    -   **Indicates if the game progresses with time or with moves by the player**

-   `mode: ("time-limit" | "move-limit" | "score-rate" | "move-rate")[]`

    -   **Indicates the game play mode, when the array is empty, it indicates that the game mode is normal**
    -   `"time-limit"`: A game mode where the game ends after a limited amount of time
    -   `"move-limit"`: A game mode where the game ends after a limited number of moves
    -   `"score-rate"`: A game mode where a score rate has to be maintained (scores per unit time)
    -   `"move-rate"`: A game mode where a move rate has to be maintained (moves per unit time)

-   `score: number`

    -   **Indicates the game score, optional param, should be provided if a game is being resumed**

-   `timeElapsed: number`

    -   **Indicates the game play time in ms, optional param, should be provided if a game is being resumed**

-   `movesMade: number`

    -   **Indicates the number of moves made by the player, optional param, should be provided if a game is being resumed**

-   `gameHistory: GameMoveType[]`

    -   **Indicates all previous game states, optional param, should be provided if a game is being resumed**

    ```ts
    GameMoveType {
        score: number;
        moves: number;
        time: Date;
        gameState: any;
    }
    ```

-   `options: string[]`

    -   **Indicates, optional param, should be provided if a game has an options menu**

-   `isOptionsVisible: boolean`

    -   **Indicates, optional param, initially set to false**

-   `speed: number`

    -   **Indicates the speed in ms at which `time-based` games progresses, optional param, must be provided if game is `time-based`**

-   `gameStartTime: Date`

    -   **Indicates the starting time of the game, optional param, should be provided if a game is being resumed**

-   `winCheckCallback: () => boolean`

    -   **Indicates the game's callback function to check if the player has won**

-   `loseCheckCallback: () => boolean`

    -   **Indicates the game's callback function to check if the player has lost**

-   `gameStateCallback: () => any`
    -   **Indicates the game's callback function to retrieve current game state**
-   `gameStateProgressionCallback: () => void`
    -   **Indicates the game's callback function to progress to next game state**
