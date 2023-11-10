import { InputValues, OutputValues } from "@google-labs/breadboard";

////////////////////////////////////////////////////////////////////////////////

export type ListInput<T> = InputValues & { list: T[] };
export type ListOutput<T> = OutputValues & { output?: T[] };
export type InputSubset<T> = InputValues & { list: T[]; count: number };
export type HeadTailOutputs<T> = OutputValues & { head?: T[]; tail?: T[] };
