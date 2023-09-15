# GCS Getter Functions

While all the properties in the `GCS` object are protected, you would be able to read the propery values using these functions:

-   `getProgression: () => "time-based" | "move-based";`

    -   Returns the progression type of the game

-   `getScore: () => number;`

    -   Returns the current score of the game

-   `getMode: () => GameModesType[];`

    -   Returns the game play modes applied on the game

-   `getIsTimeLimited: () => boolean;`

    -   Returns if the game play has a time limit,

-   `getIsMoveLimited: () => boolean;`

    -   Returns if the game play has a move limit

-   `getIsScoreRateLimited: () => boolean;`

    -   Returns if the game play has a score rate limit

-   `getIsMoveRateLimited: () => boolean;`

    -   Returns if the game play has a move rate limit

-   `getLimiters: () => GameLimitersType;`

    -   Returns all the limiters applied on the game

-   `getTimeLimit: () => number | false;`

    -   Returns the time limit in ms if there is a time limit, else returns false

-   `getMoveLimit: () => number | false;`

    -   Returns the move limit in ms if there is a time limit, else returns false

-   `getScoreRateLimit: () => GameRateLimiterType | false;`

    -   Returns the score rate limit in ms if there is a time limit, else returns false

-   `getMoveRateLimit: () => GameRateLimiterType | false;`

    -   Returns the move rate limit in ms if there is a time limit, else returns false

-   `getTimeElapsed: () => number;`

    -   Returns time elapsed in game play

-   `getIsRunning: () => boolean;`

    -   Returns if the game is currently running

-   `getHasStarted: () => boolean;`

    -   Returns if the game has starated

-   `getGameStartTime: () => Date | undefined;`

    -   Returns the game start time if game has started, else returns undefined

-   `getGameEndTime: () => Date | undefined;`

    -   Returns the game end time if game has ended, else returns undefined

-   `getSpeed: () => number;`

    -   Returns the game progression speed if it has been set, else returns `0`

-   `getMovesMade: () => number;`

    -   Returns the number of moves made if is move based game, else returns `0`

-   `getOptions: () => string[];`

    -   Returns the game menu options if it has been set, else returns `[]`

-   `getIsOptionsVisible: () => boolean;`

    -   Returns if the game menu options should be visible, defaults to `false`

-   `getGameHistory: () => GameMoveType[];`
    -   Returns the entire game state history
