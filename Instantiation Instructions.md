# Instantiating GCS Object

In order to instantiate a object of `GCS` class, a object has to be passed to the constructor.

### The following keys must be present in the constructor object

---

-   `progression: "time-based" | "move-based"`

    -   **Indicates if the game progresses with time or with moves by the player**

-   `loseCheckCallback: () => boolean`

    -   **Indicates the game's callback function to check if the player has lost**

-   `gameStateCallback: () => any`

    -   **Indicates the game's callback function to retrieve current game state**

-   `gameStateProgressionCallback: () => void`
    -   **Indicates the game's callback function to progress to next game state**

### Optional keys

---

-   `limiters: GameLimitersType`

    -   **Indicates the limits of game play**
    -   _If this key with at least one of the aforementioned limit keys is not present, it is assumed that the game play is in normal mode_

        ```ts
        interface GameRateLimiterType {
            value: number;
            unitTime: number;
        }

        interface GameLimitersType {
            timeLimit?: number;
            moveLimit?: number;
            scoreRate?: GameRateLimiterType;
            moveRate?: GameRateLimiterType;
        }
        ```

    -   `timeLimit` key is a `number`
        -   Represents the total game play time
        -   The game will end after the defined time is over from the game end time
    -   `moveLimit` key is a `number`
        -   Represent the number of moves
        -   The game will end after the defined number of moves has been made
    -   `scoreRate` key is a `GameRateLimiterType`
        -   Represent the minimum score rate per unit time
        -   The game will end if the minumum rate is not maintained by the player
    -   `moveRate` key is a `GameRateLimiterType`
        -   Represent the minimum move rate per unit time
        -   The game will end if the minumum rate is not maintained by the player

-   `winCheckCallback: () => boolean`

    -   **Indicates the game's callback function to check if the player has won**
    -   _If this key is not present, then it is assumed that the game is an infinite run game with no win state_

-   `options: string[]`

    -   **Indicates, should be provided if a game has an options menu**

-   `isOptionsVisible: boolean`

    -   **Indicates, initially set to false**

-   `speed: number`

    -   **Indicates the speed in ms at which `time-based` games progresses, must be provided if game is `time-based`**

### Other Optional keys which should be present when continuing a saved game

---

-   `score: number`

    -   **Indicates the game score, optional param**

-   `timeElapsed: number`

    -   **Indicates the game play time in ms, optional param**

-   `movesMade: number`

    -   **Indicates the number of moves made by the player, optional param**

-   `gameHistory: GameMoveType[]`

    -   **Indicates all previous game states, optional param**

        ```ts
        interface GameMoveType {
            score: number;
            moves: number;
            time: Date;
            gameState: any;
        }
        ```

-   `gameStartTime: Date`

    -   **Indicates the starting time of the game**
