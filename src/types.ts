import * as O from "fp-ts/Option";

export type Direction = "left" | "right";

export type Unit = "digits" | "groups";

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type EnterDigit = { digit: Digit };

export type Move = {
  count: number;
  direction: Direction;
  units: Unit;
};

export type SetMark = {
  location:
    | { kind: "currentLocation" }
    | { kind: "atLocation"; location: number };
};

export type Goto = {
  location: { kind: "location"; location: number } | { kind: "mark" };
};

export type StartKeycut = { keycut: StatefulKeycut };

export type SetKeycutParameters = { newParameters: string };

export type PiState = {
  mode:
    | { kind: "practice" }
    | { kind: "quiz"; mistakesMade: number; currLocation: number };
  practice: {
    nextDigitsVisibility: "show" | "hide";
    markLocation: O.Option<number>;
    currLocation: number;
  };
  keycut: O.Option<KeycutState>;
  config: Config;
};

export type PiAction =
  | { kind: "toggleMode" }
  | { kind: "restartQuiz" }
  | { kind: "toggleShowNextDigits" }
  | ({
      kind: "move";
    } & Move)
  | ({
      kind: "setMark";
    } & SetMark)
  | ({
      kind: "goto";
    } & Goto)
  | ({ kind: "enterDigit" } & EnterDigit)
  | { kind: "clearKeycut" }
  | ({ kind: "startKeycut" } & StartKeycut)
  | { kind: "executeKeycut" }
  | ({ kind: "setKeycutParameters" } & SetKeycutParameters);

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
