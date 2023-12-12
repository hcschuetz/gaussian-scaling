import { button, useControls } from "leva";
import { FC, useState } from "react"
import { Slide } from "./SlideShow"
import useMySpring from "./useMySpring";


export const SpringTest: FC = () => {

  const [displayState] = useState(() => ({
    t0: 0,
    t1: 0,
    pointss: [] as [number, number][][],
    active: true,
  }));

  const [{
    stiffness, friction, minStepsPerSec, stopAtLog,
    x: xS,
  }, set] = useControls("spring test", () => ({
    stiffness: 15,
    friction: 7,
    minStepsPerSec: 40,
    stopAtLog: 6,
    x: false,
    toggle: button((get) => {
      displayState.t0 = performance.now();
      displayState.pointss.push([]);
      displayState.active = true;
      set({x: !get("spring test.x")});
    }),
  }))

  const x = useMySpring(Number(xS), {
    stiffness, friction, minStepsPerSec, stopAt: .1**stopAtLog,
    onStop: () => {
      displayState.t1 = performance.now();
      displayState.active = false;
    },
  });

  const t = performance.now();
  const t_oldest = t - 5000;
  const {pointss, active, t0, t1} = displayState;

  if (pointss.length === 0) pointss.push([]);
  pointss.at(-1)!.push([t, x]);

cleanup:
  while (pointss.length > 1) {
    const points = pointss[0];
    while (points.length > 0) {
      if (points[0][0] >= t_oldest) {
        break cleanup;
      }
      points.shift();
    }
    pointss.shift();
  }

  const elapsedTime = (((active ? t : t1) - t0)/1000).toFixed(3);

  return (
    <Slide>
      <div style={{margin: 50}}>
        {elapsedTime}
      </div>
      <svg style={{marginTop: 50}}
        viewBox="-5, -0.5, 5, 2" width={1600} height={640}
        fill="rgb(0 0 0 / 0)" strokeWidth={0.01} stroke="white"
        transform="scale(1, -1) translate(0, 2)"
      >
        <polyline points="0,0 -5,0 -5,1 0,1 0,0" stroke="white" strokeWidth={1/320}/>
        {pointss.map((points, i) => (
          <polyline key={i} points={
            points.map(([t_val, val]) => `${((t_val-t)/1000).toFixed(3)},${val.toFixed(3)}`).join(" ")}
            stroke="white" strokeWidth={1/160}
          />
        ))}
      </svg>
      {/* <pre style={{fontSize: 20}}>{
        JSON.stringify({t, ...displayState, pointss: pointss.map(points => points.length)}, null, 2)
      }</pre> */}
    </Slide>
  )
}