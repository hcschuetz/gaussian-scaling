export type StepsDef = { from: number; to: number; step?: number; };

export function* steps({ from, to, step = 1 }: StepsDef): Generator<number, void> {
  to += 1e-8; // handle roundoff imprecision
  for (let val = from; (val-to)/step < 0; val += step) {
    yield val;
  }
}

export const stepList = (def: StepsDef): number[] => [...steps(def)];
