import { O } from "../exports";

export type Direction = "left" | "right";

export type Unit = "digits" | "groups";

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type EnterDigit = { digit: Digit };

export type Move = {
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

export type StatefulKeycut = "setMark" | "goto";

export type KeycutState = {
  kind: StatefulKeycut;
  parameters: string;
};

export type Config = {
  showExtraDigitsCount: number;
  quizLives: number;
  showPreviousDigits: boolean;
};

export type PiState = {
  mode:
    | { kind: "practice" }
    | {
        kind: "quiz";
        mistakesMade: number;
        currLocation: number;
        lastEntryWasMistake: boolean;
      };
  practice: {
    showNextDigits: boolean;
    markLocation: number;
    currLocation: number;
  };
  keycut: O.Option<KeycutState>;
};

export type GlobalState = { config: Config };

export type GlobalAction = {};
