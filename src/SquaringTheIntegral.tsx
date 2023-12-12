import { FC, useEffect } from 'react';
import { Slide, useStep } from './SlideShow';
import { Formula } from './Formula';
import { useDynamic } from './useDynamic';
import { useControls } from 'leva';

const dynamic = (...classNames: string[]): string =>
  `dynamic ${classNames.join(" ")}`;

const doHighlight = "doHighlight";
const base = {
  doHighlight: "",
  theQuestion: "enabled",
  tryI: "",
  tryI2: "",
  I2equals: "",
  squared: "",
  product: "",
  dy: "",
  halfMerged: "",
  merged: "",
  add_exponents: "",
  exp_x2y2: "",
  exp_r: "",
  halfUnmerged: "",
  solvePhiInt: "",
  unmerged: "",
  antiderivative: "",
  useAntiderivative: "",
  rIntSolved: "",
  I2solved: "",
  solved: "",
  tada: "",
};
const steps: Partial<typeof base>[] = [
  {tryI: "enabled", doHighlight},
  {tryI: "", tryI2: "enabled", doHighlight},
  {tryI2: "", theQuestion: "undisplay", I2equals: "enabled", squared: "enabled", doHighlight},
  {squared: "", product: "enabled", doHighlight},
  {product: "", dy: "enabled", doHighlight},
  {dy: "", halfMerged: "enabled", doHighlight},
  {halfMerged: "", merged: "enabled", doHighlight},
  {merged: "", add_exponents: "enabled", doHighlight},
  {add_exponents: "", exp_x2y2: "enabled", doHighlight},
  {exp_x2y2: "", exp_r: "enabled", doHighlight},
  {exp_r: "", halfUnmerged: "enabled", doHighlight},
  {halfUnmerged: "", solvePhiInt: "enabled", doHighlight},
  {solvePhiInt: "", unmerged: "enabled", doHighlight: ""},
  {unmerged: "", antiderivative: "enabled", doHighlight},
  {antiderivative: "", useAntiderivative: "enabled", doHighlight},
  {useAntiderivative: "", rIntSolved: "enabled", doHighlight},
  {I2equals: "", rIntSolved: "", I2solved: "enabled", doHighlight},
  {I2solved: "", solved: "enabled"},
  {tada: "enabled"},
];

const configs = [base];
{
  let current = base;
  function apply(step: Partial<typeof base>): void {
    configs.push(current = {...current, ...step});
  }
  for (const step of steps) {
    if (step.doHighlight) {
      // highlight only in a second step:
      apply({...step, doHighlight: ""});
      apply({doHighlight});
    } else {
      apply(step);
    }
  }
}

const fontSize = 50;

export const SquaringTheIntegral: FC = () => {
  // TODO use useControlsWithStepping(...) for the stepping functionality?

  const controlFn = () => ({
    step: {label: "step", value: 0, min: 0, max: configs.length-1, step: 1},
  })
  const [{step}, set] = useControls("squaring", controlFn);
  const ref = useDynamic(step);

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown": return set({step: event.ctrlKey ? configs.length - 1 : ref.current + 1});
        case "ArrowUp"  : return set({step: event.ctrlKey ? 0                  : ref.current - 1});
      }
    };
  
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, []);

  const config = configs[step];

  useStep(step);
  return (<>
    <Slide>
      <pre style={{display: "none", position: "fixed", top: 0, left: 0, fontSize: 20}}>{
        Object.entries(config).flatMap(([k, v]) => v ? [k] : []).join(", ")
      }</pre>
      <h2 style={{alignSelf: "center"}}>Computing the Integral</h2>
      <div className={config.doHighlight} style={{ position: "relative", fontSize }}>
        <style>{`
          .centered {
            position: absolute;
            top: 0;
            width: 100vw;
            left: 50%;
            transform: translate(-50%, 0);
          }
          .doHighlight .highlight {
            color: magenta;
            transition: color 0.5s;
          }
          .unhighlight {
            color: white;
            transition: color 0.5s;
          }
          .dynamic {
            opacity: 0;
            transition: opacity 0.5s;
          }
          .dynamic.enabled {
            opacity: 1;
            transition: opacity 0.5s;
          }
          .undisplay {
            display: none;
          }
        `}</style>
        <Formula className={dynamic(config.theQuestion)} style={{ fontSize }} math={String.raw`
          I\;≔\;
          \intR{x}{\bell{x}\,}
          \stackrel{?}=\;
          \sqrt\turn
        `}/>
        <div style={{position: "relative", textAlign: "center"}}>
          <div className={"centered " + dynamic(config.tryI) + " " + dynamic(config.tryI2)} style={{marginTop: 40}}>
            Try to derive
            <div style={{position: "relative", marginTop: 40}}>
              <Formula inline className={"centered " + dynamic(config.tryI)}
                style={{ fontSize }}
                math="I = \highlight{\sqrt{\unhighlight{\turn}}}"
              />
              <Formula inline className={"centered " + dynamic(config.tryI2)}
                style={{ fontSize }}
                math="\highlight{I}^2 = \turn"
              />
            </div>
          </div>
          <Formula className={"centered " + dynamic(config.I2equals)}
            style={{ fontSize }}
            math="I^2 =" />
          <div style={{position: "relative", top: 150}}>
            <Formula className={"centered " + dynamic(config.squared)}
              style={{fontSize}}
              math="
                \paren(){
                  \intR{x}{\bell{x}\,}
                }^{\highlight{2}}
              "
            />
            <Formula className={"centered " + dynamic(config.product)}
              style={{fontSize}}
              math="
                \paren(){
                  \intR{x}{\bell{x}\,}
                }
                \paren(){
                  \intR{\highlight{x}}{\bell{\highlight{x}}\,}
                }
              "
            />
            <Formula className={"centered " + dynamic(config.dy)}
              style={{fontSize}}
              math="
                \highlight{
                  \paren(){
                    \intR{x}{\bell{x}\,}
                  }
                }
                \paren(){
                  \intR{y}{\bell{y}\,}
                }
              "
            />
            <Formula className={"centered " + dynamic(config.halfMerged)}
              style={{fontSize}}
              math="
                \intR{y}{
                  \paren(){
                    \intR{x}{\bell{x}\,}
                  }
                  \highlight{\bell{y}}\,
                }
              "
            />
            <Formula className={"centered " + dynamic(config.merged)}
              style={{fontSize}}
              math="
                \intR{y}{
                  \intR{x}{
                    \highlight{
                      \bell{x}
                      \bell{y}
                    }\,
                  }\;
                }
              "
            />
            <Formula className={"centered " + dynamic(config.add_exponents)}
              math="
                \intR{y}{
                  \intR{x}{
                    \expon{\highlight{-\oneHalf} x^2 \highlight{-\oneHalf} y^2}\,
                  }\;
                }
              "
            />
            <Formula className={"centered " + dynamic(config.exp_x2y2)}
              math="
                \highlight{
                  \intR{y}{
                    \intR{x}{
                      \unhighlight{
                        \expon{-\oneHalf \highlight{(x^2+y^2)}}
                      }\,
                    }\;
                  }
                }
              "
            />
            <Formula className={"centered " + dynamic(config.exp_r)}
              style={{textAlign: "center", fontSize}}
              math="
                \intRad{
                  \intPhi{
                    \highlight{
                      \bell{r}\,
                      r
                    }\;
                  }\;
                }
              "
            />
            <Formula className={"centered " + dynamic(config.halfUnmerged)}
              style={{textAlign: "center", fontSize}}
              math="
                \intRad{
                  \bell{r}\,
                  \highlight{
                    \paren(){
                      \intPhi{
                        1\;
                      }
                    }
                  }\,
                  r\;
                }
              "
            />
            <Formula className={"centered " + dynamic(config.solvePhiInt)}
              style={{textAlign: "center", fontSize}}
              math="
                \intRad{
                  \bell{r}\,
                  \highlight{
                    \turn
                  }
                  r\;
                }
              "
            />
            <Formula className={"centered " + dynamic(config.unmerged)}
              style={{textAlign: "center", fontSize}}
              math="
                \turn
                \intRad{
                  \bell{r}
                  r
                  \;
                }
              "
            />
            <div className={"centered " + dynamic(config.antiderivative)}
              style={{textAlign: "center", width: "100vw", fontSize}}
            >
              <Formula
                math="
                  \turn
                  \highlight{
                    \intRad{
                      \unhighlight{
                        \underbrace{
                          \highlight{
                            \bell{r}
                            r
                          }
                        }
                      }\;
                    }
                  }
                "
              />
              <span style={{marginRight: "0.5em"}}>derivative of</span>
              <Formula inline math="\displaystyle-\bell{r}"/>
            </div>
            <Formula className={"centered " + dynamic(config.useAntiderivative)}
              style={{textAlign: "center", fontSize}}
              math="
                \turn
                \highlight{
                  \paren[]{
                    -\bell{r}
                  }_{r=0}^{r\rightarrow\infty}
                }
              "
            />
            <Formula className={"centered " + dynamic(config.rIntSolved)}
              style={{textAlign: "center", fontSize}}
              math="\turn\;\highlight{(0 - (-1))}"
            />
          </div>
          <Formula className={"centered " + dynamic(config.I2solved)}
            style={{textAlign: "center", fontSize: 70}}
            math="I^{\highlight{2}} = \turn"
          />
          <div className={"centered " + dynamic(config.solved)}
            style={{textAlign: "center", width: "100vw", fontSize: 70}}
          >
            <Formula
              style={{fontSize: 70, marginBottom: 50}}
              math="I = \sqrt\turn"
            />
            <span className={dynamic(config.tada)} style={{fontSize: "200%"}}>🎉</span>
          </div>
        </div>
      </div>
    </Slide>
    </>);
};
