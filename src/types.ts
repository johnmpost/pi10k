export type Direction = "left" | "right";

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type KeycutAction =
  | { kind: "toggleMode" }
  | { kind: "restartQuiz" }
  | { kind: "toggleShowNextDigits" }
  | {
      kind: "move";
      count: number;
      direction: Direction;
      units: "digits" | "groups";
    }
  | {
      kind: "setMark";
      location:
        | { kind: "currentLocation" }
        | { kind: "atLocation"; location: number };
    }
  | {
      kind: "goto";
      location: { kind: "location"; location: number } | { kind: "mark" };
    };

export type KeycutState = {
  kind: "move" | "setMark" | "goto";
  parameters: string;
};

export type Grouping = {
  startLocation: number;
  groupSize: number;
};

export type Config = {
  showExtraDigitsCount: number;
  allowedQuizMistakes: number;
  groupings: Grouping[];
};
