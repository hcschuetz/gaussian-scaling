import { useEffect, useMemo, useState } from "react";

/**
 * This is similar to react-spring.  But the latter goes "under the hood" of
 * React tweaking the DOM (or whatever data tree) and bypassing React rendering
 * and the virtual DOM for efficiency.  This simpler implementation will trigger
 * React re-renderings, but does not require "animated" versions of React
 * components.
 */

export default function useMySpring(
  xTarget: number,        // given in some user-specific unit u (e.g., pixels, metres, ...)
  {
    stiffness = 10,       // given in 1/s^2
    friction = 7,         // given in 1/s
    minStepsPerSec = 40,  // given in 1/s
    stopAt = 1e-7,        // fraction of the initial energy
    onStop = undefined as (() => void) | void,
                          // callback for when the motion has stopped
    name = "",            // for logging
  } = {},
) {
  function log(...args: any) {
    if (name) console.log("spring", name, ...args);
  }

  useEffect(() => {
    if (minStepsPerSec <= friction) {
      console.warn(
        `Unstable parameters for spring "${name}":
friction = ${friction}, minStepsPerSec = ${minStepsPerSec}.
Choose minStepsPerSec > friction.`
      );
    }
    // TODO Warn about stiffness as well? If stiffness > 0.5 * minStepsPerSec^2?
  }, [minStepsPerSec, friction]);

  // - `xTarget` is the position to which we want to move (i.e., toward which
  //   the spring pulls) whereas `x` is the actual current position.
  // - `v` is the current speed in u/s.
  // - `t` is the current time in ms, but only while motion is not stopped.
  // - `stopped` says if the spring is inactive.
  const [state, setState] =
    useState(() => ({x: xTarget, v: 0, t: 0, stopped: true}));
  const {x, v, stopped} = state;

  // energies are measured in u^2/s^2
  const energyLimit = useMemo(
    () => stopAt * (0.5 * stiffness * (x - xTarget)**2),
    [stiffness, xTarget, stopAt], // Do not recompute upon changing `x`.
  );

  if (xTarget !== x || v !== 0) {
    if (stopped) {
      // (Re-)starting motion.  We did not keep track of the time while the
      // spring was stopped.  So we have to update it now.
      state.t = performance.now();
    }
    // The "spring update loop"
    // ------------------------
    // Notice that the following callback does **not** call
    // `requestAnimationFrame(...)` again.  It just calls `setState(...)`
    // causing React to re-render.  So execution comes here again (if there is
    // still energy in the system), where we anyway call
    // `requestAnimationFrame(...)` again.
    requestAnimationFrame((newT: number) => {
      let {x, v, t} = state;

      const stopped = 0.5 * (v*v + stiffness * (x - xTarget)**2) < energyLimit;
      if (newT <= t) {
        // In dev mode with StrictMode enabled duplicate render calls occur.
        // See, e.g.,
        // https://andreasheissenberger.medium.com/react-components-render-twice-any-way-to-fix-this-91cf23961625
        // In this case we get two calls to this callback function with the
        // same time stamp.  The following cases would handle this correctly
        // with `nSteps = 0` and thus no steps in the `for` loop.
        // But we avoid the calculation of `stepSize = NaN` (which is not
        // used anyway) and, more importantly, a confusing log message.
      } else if (stopped) {
        log("------------------");
        x = xTarget;
        v = 0;
        t = newT;
        if (onStop) {
          onStop();
        }
      } else {
        const deltaT = (newT - t) * 1e-3; // convert milliseconds to seconds
        
        // # of animation frames since the last update:
        log("\n|" + "*".repeat(Math.round(deltaT * 60)) + "|");
        
        // Use short simulation steps (so that we need not use complicated
        // "long-term" motion equations):
        const nSteps = Math.ceil(deltaT * minStepsPerSec);
        const stepSize = deltaT / nSteps; // in seconds
        for (let i = 0; i < nSteps; i++) {
          // In contrast to typical physics our friction is speed-dependent:
          v -= (stiffness * (x - xTarget) + friction * v) * stepSize;
          x += v * stepSize;
        }
        t = newT;
      }
      setState({x, v, t, stopped});
    });
  }

  return x;
}
