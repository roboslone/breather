export type ActionType = "in" | "out" | "hold in" | "hold out";

export interface Action {
  type: ActionType;
  duration: number; // seconds
}
