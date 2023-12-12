import { FC } from "react";
import { Formula } from "./Formula";
import { DynamicItems, Slide } from "./SlideShow";

export const IntegrationSummary: FC = () => (
  <Slide>
    <style>{`
      li {
        margin: 120px 0;
      }
      .highlight {
        color: magenta;
      }
    `}</style>
    <div style={{padding: "0 120px"}}>
      <h2>Summary: The Central Steps</h2>
      <ul>
        <DynamicItems folder="integration summary">
          <li>
            Use {}
            <Formula inline math="
              \displaystyle
              \paren(){
                \intR{x}{\bell{x}}
              }^{\highlight{2}}
            "/>
            {} and convert it to a double integral.
          </li>
          <li>
            <Formula inline math="
              \displaystyle
              \bell{x}\bell{y}
              \;=\;
              \expon{-\oneHalf (\highlight{x^2 + y^2})}
              \;=\;
              \bell{r}
            "/>
          </li>
          <li>
            <Formula inline style={{paddingRight: "0.5em"}} math="
              \displaystyle
              \bell{r}\,\highlight{r}
            "/>
            {} has a closed-form antiderivative.
          </li>
        </DynamicItems>
      </ul>
    </div>
  </Slide>
);
