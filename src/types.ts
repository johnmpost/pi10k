export type Direction = "left" | "right";

export type Unit = "digits" | "groups";

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type PiAction =
  | { kind: "toggleMode" }
  | { kind: "restartQuiz" }
  | { kind: "toggleShowNextDigits" }
  | {
      kind: "move";
      count: number;
      direction: Direction;
      units: Unit;
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
    }
  | { kind: "enterDigit"; digit: Digit }
  | { kind: "clearKeycut" }
  | { kind: "startKeycut"; keycut: StatefulKeycut }
  | { kind: "executeKeycut" }
  | { kind: "setKeycutParameters"; newParameters: string };

export type StatefulKeycut = "move" | "setMark" | "goto";

export type KeycutState = {
  kind: StatefulKeycut;
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
