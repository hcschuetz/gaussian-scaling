import { buttonGroup, useControls } from "leva";
import { useEffect, useRef } from "react";
import { useStep } from "./SlideShow";

// Ideally `Decls` should be a template parameter of `useControlsWithStepping`,
// but I am not sure if this can be properly declared in TypeScript.
// The dummy type declarations here provide at least some typechecking
// *within* the implementation of `useControlsWithStepping`.
// The exported type of `useControlsWithStepping` is far too weak.
// Application code should derive the necessary types from its actual
// variation of `Decls`.

type Decls = {
  foo: {value: boolean},
  bar: {value: number},
};

type Values = { [K in keyof Decls]: Decls[K]["value"]; };

type Updates = Partial<Values>[];

type ValuesWithStep = Values & {step: number};

function useControlsWithStepping(folder: string, controlDecls: Decls, stepUpdates: Updates): ValuesWithStep {
  const [controls, setControls] = useControls(folder, () => ({
    step: { value: 0, min: 0, max: stepUpdates.length, step: 1, onEditEnd: val => toStep(val) },
    " ": buttonGroup({
      "<<": (): void => toStep(0),
      "<" : (): void => toStep(stepRef.current - 1),
      ">" : (): void => toStep(stepRef.current + 1),
      ">>": (): void => toStep(stepUpdates.length),
    }),
    ...controlDecls,
  }));

  // Needed because leva button callbacks are apparently not updated.
  // Using `step` directly instead of `stepRef.current` would thus give
  // `step`'s initial value.
  const stepRef = useRef<number>(0);
  stepRef.current = controls.step;

  useStep(controls.step);

  const toStep = (step: number): void => setControls({
    step,
    // Accumulate step updates starting with the initial values
    ...stepUpdates.slice(0, Math.max(0, step)).reduce(
      (acc, newVals) => Object.assign(acc, newVals),
      Object.fromEntries(Object.entries(controlDecls).map(([k, v]) => [k, v.value]))
    ),
  });

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent): void => {
      switch (e.key) {
        case "ArrowUp"  : return toStep(e.ctrlKey ? 0                  : stepRef.current - 1);
        case "ArrowDown": return toStep(e.ctrlKey ? stepUpdates.length : stepRef.current + 1);
      }
    };
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, []);

  return controls;
}

export default useControlsWithStepping as (folder: string, controlDecls: any, stepUpdates: any[]) => any;
