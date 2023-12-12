import { FC } from 'react';
import { DynamicItems, Slide } from './SlideShow';
import { Formula } from './Formula';

export const TheQuestion: FC = () => (
  <Slide>
    <div style={{ textAlign: "center", paddingTop: 100 }}>
      <Formula display="yellow" style={{ padding: 15 }} math="
        \intR{x}{\bell{x}} \;=\; \sqrt\turn
      "/>
      <DynamicItems folder="question">
        <div>Why does this hold?</div>
        <div style={{ paddingTop: 100 }}>
          And where does the
          <Formula style={{ padding: 15 }} display="yellow" math="\piOrTau" />
          come from?
        </div>
      </DynamicItems>
    </div>
  </Slide>
);
