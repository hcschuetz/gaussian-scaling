import { FC } from 'react';
import "./SurfaceGeometry"
import 'katex/dist/katex.min.css';
import { Slide, SlideShow } from './SlideShow';
import NormalDistribution2D from './NormalDistribution2D';
import Colophon from './Colophon';
import { ParamsAndScaling } from './ParamsAndScaling';
import { TheQuestion } from './TheQuestion';
import { PiShowingUp } from './PiShowingUp';
import { Gamification } from './Gamification';
import { SquaringTheIntegral } from './SquaringTheIntegral';
import { IntegrationSummary } from './IntegrationSummary';
import { Variance1, Variance2 } from './Variance';
import { Leva } from 'leva';
import { SpringTest } from './SpringTest';
import { Title } from './Title';

const GaussianScaling: FC = () => (<>
  <Title>The Scaling Factor in the Gaussian Distribution</Title>
  <Leva collapsed/>
  <SlideShow>
    {/* <SpringTest/> */}
    <Slide style={{fontSize: 40,
      textAlign: "center", justifyContent: "center"}}>
      <h1 style={{lineHeight: "200%"}}>
        The Scaling Factor
        <br/>
        in the
        <br/>
        Gaussian Distribution
      </h1>
    </Slide>
    <ParamsAndScaling/>
    <TheQuestion/>
    <Gamification/>
    {/* <SphereTriangulation/> */}
    <PiShowingUp/>
    <SquaringTheIntegral/>
    <NormalDistribution2D/>
    <IntegrationSummary/>
    {/* <PolarIntegral/> */}
    <Variance1/>
    <Variance2/>
    <Colophon/>
  </SlideShow>
</>);

export default GaussianScaling;
