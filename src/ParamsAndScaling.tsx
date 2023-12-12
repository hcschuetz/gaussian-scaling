import { FC, useMemo } from 'react';
import TAU from './TAU';
import { stepList } from './StepsDef';
import { Slide } from './SlideShow';
import { Formula } from './Formula';
import useControlsWithStepping from './useControlsWithStepping';
import useMySpring from './useMySpring';
import { useControls } from 'leva';


const paramCol = "cyan";
const stdCol = "yellow";

const xs = stepList({from: -5, to: 5, step: 1 / 64});

const fn = (x: number, options: {scaleFactor: number, mu?: number, sigma?: number}) => {
  const { scaleFactor, mu = 0, sigma = 1 } = options;
  return scaleFactor * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}


const controlDecls = {
  showIntegral: { label: "show ∫", value: false },
  showMu: { label: "show μ", value: false },
  mu: { label: "μ", value: 2, min: -5, max: 5 },
  showSigma: { label: "show σ", value: false },
  sigma: { label: "σ", value: 0.3, min: 0.2, max: 5 },
  omitScaling: { label: "no scaling", value: false },
  showStdParams: { label: "std params", value: false },
};

type Decls = typeof controlDecls;
type Values = { [K in keyof Decls]: Decls[K]["value"]; };

const stepUpdates: Partial<Values>[] = [
  { showIntegral: true },
  { showMu: true },
  { mu: 3.7},
  { mu: -1.5},
  { mu: 2 },
  { showSigma: true },
  { sigma: 2.5 },
  { sigma: 0.2 },
  { sigma: 0.3 },
  { omitScaling: true },
  { sigma: 2.5 },
  { sigma: 0.2 },
  { sigma: 0.3 },
  { omitScaling: false },
  { showStdParams: true },
  { omitScaling: true },
];

export const ParamsAndScaling: FC = () => {
  const {
    showIntegral, omitScaling, showStdParams,
    showMu, mu: muS, showSigma, sigma: sigmaS,
  }: Values = useControlsWithStepping("scaling", controlDecls, stepUpdates);

  const mu = useMySpring(muS);
  const sigma = useMySpring(sigmaS);

  const degreeOfScaling = useMySpring(omitScaling ? 0 : 1);
  const scaleFactor = (1 - degreeOfScaling) + degreeOfScaling / (sigma * Math.sqrt(TAU));
  const scaleFactor1 = (1 - degreeOfScaling) + degreeOfScaling / Math.sqrt(TAU);

  const fillOpacity = useMySpring(showIntegral ? 1 : 0);
  const stdOpacity = useMySpring(showStdParams ? 1 : 0);
  const muOpacity = useMySpring(showMu || showSigma ? 1 : 0);
  const sigmaOpacity = useMySpring(showSigma ? 1 : 0);

  const ys = useMemo(
    () => xs.map(x => `${x.toFixed(3)},${fn(x, { scaleFactor, mu, sigma }).toFixed(3)}`).join(" "),
    [scaleFactor, mu, sigma],
  );
  const ys_std = useMemo(
    () => xs.map(x => `${x.toFixed(3)},${fn(x, { scaleFactor: scaleFactor1 }).toFixed(3)}`).join(" "),
    [scaleFactor1],
  );

  return (<Slide>
    {useControls("debug", {springVals: false}).springVals &&
      <pre style={{position: "absolute", left: 0, bottom: 0, fontSize: 15}}>{
        JSON.stringify(Object.fromEntries(Object.entries({
          fillOpacity, stdOpacity, muOpacity, sigmaOpacity,
          mu, sigma, degreeOfScaling, scaleFactor, scaleFactor1
        }).map(([k, v]) => [k, v.toFixed(3)])))
      }</pre>
    }

    <style>{`
      .scaling_hidden .noscaling,
      .scaling_visible .scaling {
        opacity: 1;
        transition: opacity 1s;
      }

      .scaling_visible .noscaling,
      .scaling_hidden .scaling {
        opacity: 0;
        transition: opacity 1s;
      }
    `}</style>
    <div className={omitScaling ? "scaling_hidden" : "scaling_visible"}
      style={{
        position: "fixed", zIndex: 2, left: 80, top: 80,
        display: "grid",
        gridTemplate: "50px 200px 200px / 280px 650px 600px",
        justifyItems: "start", alignItems: "center",
        fontSize: 35, color: "white",
      }}
    >
      <b>Parameters</b>
      <b style={{ paddingLeft: (omitScaling ? "4em" : "0"), transition: "padding-left 1s" }}>
        {omitScaling ? "Unscaled" : "Density"} Function</b>
      <b style={{ opacity: fillOpacity }}>Integral</b>

      <Formula display={paramCol}
        style={{ position: "relative", left: -14 /* compensate array margin */ }}
        math={String.raw`
        \begin{array}{l}\mu=${mu.toFixed(2)}\\ \sigma=${sigma.toFixed(2)}\end{array}
      `} />
      <Formula display={paramCol} math="
        \htmlClass{scaling}{\frac{1}{\sigma\sqrt{\turn}}\;}
        \expon{-\frac12\paren(){\frac{x-\mu}{\sigma}}^2}
      "/>
      <Formula display={paramCol} style={{opacity: fillOpacity}}
        math={String.raw`
        \intR{x}{\;\ldots\;}\;=\;
        \htmlClass{scaling}{1}\!\!\!
        \htmlClass{noscaling}{\sigma\sqrt{\turn}\;\approx\;${(sigma * Math.sqrt(TAU)).toFixed(3)}}
      `} />

      <Formula display={stdCol}
        style={{ position: "relative", left: -14 /* compensate array margin */, opacity: stdOpacity }}
        math={String.raw`\begin{array}{l}\mu=0\\ \sigma=1\end{array}`} />
      <Formula display={stdCol} style= {{opacity: stdOpacity}} math="
        \htmlClass{scaling}{\frac{1}{\sqrt{\turn}}\;\;\;}
        \bell{x}
      " />
      <Formula display={stdCol} style= {{opacity: stdOpacity * fillOpacity}} math={String.raw`
        \intR{x}{\;\ldots\;}\;=\;
        \htmlClass{scaling}{1}\!\!\!
        \htmlClass{noscaling}{\sqrt{\turn}}
      `} />
    </div>

    <div style={{
      position: "absolute", bottom: 40, left: "50vw",
      width: 1800,
      transform: "translate(-50%, 0)",
    }}>
      <svg
        viewBox="-6, -0.5, 12, 3" width={1800} height={450}
        fill="rgb(0 0 0 / 0)" strokeWidth={0.01} stroke="white"
        transform="scale(1, -1) translate(0, 2)"
      >
        <line x1={-5} x2={5}/>
        <line y1={-0.5} y2={2.3}/>
        {stepList({from: -4, to: 4}).map(x => (
          <line key={x} x1={x} x2={x} y1={-0.05} y2={0.05}/>
        ))}
        {stepList({from: 0, to: 2}).map(y => (
          <line key={y} x1={-0.05} x2={0.05} y1={y} y2={y}/>
        ))}

        <polyline points={ys} strokeWidth={0.02} stroke={paramCol}/>
        <polygon points={"-5,0 " + ys + " 5,0"}
          stroke={"rgb(0 0 0 / 0)"} fill={paramCol} opacity={fillOpacity * 0.5}/>

        <g opacity={muOpacity}>
          <line x1={mu} x2={mu} y1={-0.2} y2={2.2}/>
          <g transform={`translate(${mu.toFixed(3)}, -0.4) scale(0.004, -0.004)`}>
            <text textAnchor="middle" fill="#ffffff" stroke="white" strokeWidth={1}
            >{mu.toFixed(2)}</text>
          </g>
        </g>

        <g opacity={sigmaOpacity}>
          <line x1={mu+sigma} x2={mu+sigma} y1={-0.2} y2={2.2}/>
          <line x1={mu-sigma} x2={mu-sigma} y1={-0.2} y2={2.2}/>
          <DoubleArrow x1={mu-sigma} x2={mu} y={2.1}/>
          <DoubleArrow x1={mu} x2={mu+sigma} y={2.1}/>
          <g transform={`translate(${(mu + sigma/2).toFixed(3)}, 2.3) scale(0.004, -0.004)`}>
            <text textAnchor="middle" fill="#ffffff" stroke="white" strokeWidth={1}
            >{sigma.toFixed(2)}</text>
          </g>
        </g>

        <g opacity={stdOpacity}>
          <polyline points={ys_std} strokeWidth={0.02} stroke={stdCol}/>
          <polygon points={"-5,0 " + ys_std + " 5,0"}
            stroke={"rgb(0 0 0 / 0)"} fill={stdCol} opacity={fillOpacity * 0.5}/>
        </g>
      </svg>
    </div>
  </Slide>
  );
};

const arrowX = 0.07, arrowY = 0.02;
const DoubleArrow: FC<{x1: number, x2: number, y: number}> = ({x1, x2, y}) => (
  <g>
    <line x1={x1} x2={x2} y1={y} y2={y}/>
    <polygon points={`${x1},${y} ${x1+arrowX},${y+arrowY} ${x1+arrowX},${y-arrowY}`} fill="#fff"/>
    <polygon points={`${x2},${y} ${x2-arrowX},${y+arrowY} ${x2-arrowX},${y-arrowY}`} fill="#fff"/>
  </g>
);
