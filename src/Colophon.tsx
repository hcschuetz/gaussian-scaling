import { FC } from "react"
import { DynamicItems, Slide } from "./SlideShow";

const Colophon: FC = () => (
  <Slide style={{fontSize: 60, paddingLeft: 300}}>
    <h3>Tools Used</h3>
    (web technologies only)
    <ul>
      <DynamicItems folder="colophon">
        <li>basics: TypeScript, React, and Vite</li>
        <li>three.js, react-three-fiber, and drei</li>
        <li>SVG <span style={{opacity: 0.4}}>[PixiJS and ReactPixi or plain &lt;canvas&gt;]</span></li>
        <li>KaTeX and <span style={{opacity: 0.7}}>@matejmazur/</span>react-katex</li>
        <li>leva</li>
        <li>home-grown slide-show tools</li>
      </DynamicItems>
    </ul>
  </Slide>
);

export default Colophon;
