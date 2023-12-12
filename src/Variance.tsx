import { Schema } from "leva/dist/declarations/src/types";
import { FC } from "react"
import { Formula } from "./Formula"
import { Slide } from "./SlideShow"
import { stepList } from "./StepsDef";
import TAU from "./TAU";
import useControlsWithStepping from "./useControlsWithStepping";

export const Variance1: FC = () => (
  <Slide style={{paddingTop: 300, textAlign: "center"}}>
    And what about
    <Formula style={{margin: 100}} math="\frac1{\sqrt\turn}\expon{-{\color{yellow}\oneHalf}x^2}"/>
    ?
  </Slide>
);

// ---------------------------------------------------------------------------

const N = (x: number) => 1/Math.sqrt(TAU) * Math.exp(-1/2 * (x*x));
const N1 = (x: number) => - x * N(x);
const N2 = (x: number) => (x*x - 1) * N(x);
const x2N = (x: number) => (x*x) * N(x);
// const x2N = (x: number) => N2(x) + N(x);

const R = String.raw;

type RowNames = "N" | "N1" | "N2" | "x2N" | "VarN";
type RowFormulas = {
  left: string,
  rights: string[],
  fn?: (x: number) => number,
  fill?: string,
};

const formulas: Record<RowNames, RowFormulas> = {
  N: {
    left: R`\varphi(x)`,
    rights: [
      R`≔\;\frac{1}{\sqrt\turn} \bell{x}`,
    ],
    fn: N,
  },
  N1: {
    left: R`\varphi'(x)`,
    rights: [
      '',
      R`=\;\highlight{\frac{1}{\sqrt\turn} \bell{x}} (-\oneHalf)\, (2x)`,
      R`=\;\varphi(x)\; (-\highlight{\oneHalf})\, (\highlight{2}x)`,
      R`=\;\varphi(x)\; \highlight{(-x)}`,
      R`=\;-x\;\varphi(x)`,
    ],
    fn: N1,
  },
  N2: {
    left: R`\varphi''(x)`,
    rights: [
      '',
      R`=\;-(\highlight{1}\;\varphi(x) + x\;\varphi'(x))`,
      R`=\;-(\varphi(x) + x\;\highlight{\varphi'(x)})`,
      R`=\;\highlight{-}(\varphi(x) \highlight{+} x\;(\highlight{-}x\;\varphi(x)))`,
      R`=\;-\varphi(x) + \highlight{x}\;(\highlight{x}\;\varphi(x))`,
      R`=\;-\highlight{\varphi(x)} + x^2\;\highlight{\varphi(x)}`,
      R`=\;{\color{#667}(x^2-1)\;\varphi(x)}`,
      R`=\;-\varphi(x) + \highlight{x^2\;\varphi(x)}`,
      R`=\;-\varphi(x) + x^2\;\varphi(x)`,
    ],
    fn: N2,
  },
  x2N: {
    left: R`x^2\;\varphi(x)`,
    rights: [
      R`=\; \varphi''(x) + \varphi(x)`,
    ],
    fn: x2N,
  },
  VarN: {
    left: R`\mathrm{Var}[\varphi]`,
    rights: [
      '',
      R`=\;\intR{x}{(x\highlight{-\mu})^2\;\varphi(x)\;}`,
      R`=\;\intR{x}{\highlight{x^2\;\varphi(x)}\;}`,
      R`=\;\intR{x}{\varphi''(x) \highlight{+} \varphi(x)\;}`,
      R`=\;\intR{x}{\varphi''(x)\;} + \highlight{\intR{x}{\varphi(x)\;}}`,
      R`=\;\highlight{\intR{x}{\varphi''(x)\;}} + 1`,
      R`=\;\highlight{\paren[]{\varphi'(x)}_{x\rightarrow-\infty}^{x\rightarrow+\infty}} + 1`,
      R`=\;\highlight{(0 - 0) + 1}`,
      R`=\;1`,
    ],
    fn: x2N,
    fill: "rgb(255 255 255 / 50%)",
  },
};

type Config = Record<string, number | boolean>;

const schema: Schema = {};
const base: Config = {};
const updates: Config[] = [];
for (const [name, {rights}] of Object.entries(formulas)) {
  const n_left = name + "_left";
  schema[n_left] = {value: false};
  base[n_left] = false;

  const n_right = name + "_right";
  schema[n_right] = {value: 0, min: 0, max: rights.length, step: 1};
  base[n_right] = 0;

  const n_highlight = name + "_highlight";
  schema[n_highlight] = {value: false};
  base[n_highlight] = false;

  rights.forEach((right, i) => {
    const update: Config = {[n_right]: i + 1, [n_highlight]: false};
    if (i === 0) update[n_left] = true;
    updates.push(update);
    if (right.includes(R`\highlight`)) updates.push({[n_highlight]: true});
  });
}

// Enforce uniform formula height
const phantom = R`\phantom{\intR{x}{\frac1{\sqrt\turn}}}`;

export const Variance2: FC = () => {
  const config = useControlsWithStepping("variance", schema, updates) as Config;
  return (<>
    <style>{`
      .doHighlight .highlight {
        color: magenta;
        transition: color 0.5s;
      }
    `}</style>
    <Slide style={{fontSize: 45}}>
      {Object.entries(formulas).map(([name, {left, rights, fn, fill}], i) => (
        <div key={name} className={config[name + "_highlight"] ? "doHighlight" : ""}
          style={{position: "absolute", left: 70, right: 70, top: 20 + 200 * i}}
        >
          <Formula style={{
            position: "absolute", left: 0, top: 0,
            opacity: config[name + "_left"] ? 1 : 0,
            transition: "opacity 0.5s",
          }} math={left + phantom}/>
          {rights.map((right, j) => (
            <Formula key={j} style={{
              position: "absolute", left: 210, top: 0,
              opacity: j === config[name + "_right"] as number - 1 ? 1 : 0,
              transition: "opacity 0.5s",
            }} math={right + phantom}/>
          ))}
          {fn && (
            <svg style={{position: "absolute", top: 25, right: 0,
              opacity: config[name + "_left"] ? 1 : 0,
              transition: "opacity 0.5s",
            }}
              width={720} height={180} viewBox="-5 -1.25 10 2.5"
              fill="rgb(0 0 0 / 0)" strokeWidth={0.01} stroke="white"
              transform="scale(1, -1) translate(0, 2)"
            >
              <line x1={-5} x2={5}/>
              <line y1={-1.25} y2={1.25}/>
              {stepList({from: -5, to: 5}).map(x => (
                <line key={x} x1={x} x2={x} y1={-0.05} y2={0.05}/>
              ))}
              <line x1={-0.05} x2={0.05} y1={1} y2={1}/>
              <line x1={-0.05} x2={0.05} y1={-1} y2={-1}/>
              <path d={
                stepList({from: -5, to: 5, step: 0.01}).map((x, i) =>
                  `${(i === 0 ? "M" : "L")} ${x} ${fn(x).toFixed(3)}`
                ).join(" ") + (fill ? " z" : "")
              } strokeWidth={0.02} fill={fill ?? "rgb(0 0 0/ 0)"}/>
            </svg>
          )}
        </div>
      ))}
    </Slide>
  </>)
}