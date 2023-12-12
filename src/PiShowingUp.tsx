import { FC } from 'react';
import { DynamicItems, Slide } from './SlideShow';
import { Formula } from './Formula';

export const PiShowingUp: FC = () => (
  <Slide style={{ textAlign: "center" }}>
    <h2>Examples for <Formula inline math="\color{yellow}\pi"/> showing up</h2>
    <DynamicItems folder="π showing up">
      <div>
        <Formula math="
          1 - \frac13 + \frac15 - \frac17 + \frac19 - \frac1{11} + \cdots
          + \frac1{4n+1} - \frac1{4n+3} + \cdots = \frac{\color{yellow}\pi}{4}
        "/>
        (Madhava/Gregory/Leibniz)
      </div>
      <div style={{marginTop: 100}}>
        <Formula math="
          1 + \frac14 + \frac19 + \frac1{16} + \cdots
          + \frac1{n^2} + \cdots = \frac{{\color{yellow}\pi}^2}6
        "/>
        (Euler)
      </div>
    </DynamicItems>
  </Slide>
);

