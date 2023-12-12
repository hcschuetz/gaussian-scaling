import { Line, LineProps, OrbitControls, PresentationControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber"
import { FC } from "react";
import { stepList, steps } from "./StepsDef";
import TAU from "./TAU";
import { ColorRepresentation, DoubleSide, Vector3 } from "three";
import { combineSurfaceGenerators, quadrangulate, SurfaceGenerator } from "./SurfaceGeometry";
import useControlsWithStepping from "./useControlsWithStepping";
import { Slide } from "./SlideShow";
import { Formula } from "./Formula";
import useMySpring from "./useMySpring";

const coordLimit = 5;
const fnLimit = 5;

// Ensure that wires appear on top of the surface:
const wireOffset = 5e-3;

const xyLimits: [number, number] = [-fnLimit, fnLimit];

// This is actually not yet scaled by 1/Math.sqrt(TAU):
const fn = (x: number, y: number) => Math.exp(-0.5 * (x**2 + y**2));
const fnR = (r: number) => fn(r, 0);

const schema = {
  polar: {value: false},
  showFnGrid: {label: "fn grid", value: true},
  showContour: {label: "contour", value: false},
  xRange: {label: "x range", value: xyLimits, min: -fnLimit, max: fnLimit, step: 0.2},
  yRange: {label: "y range", value: xyLimits, min: -fnLimit, max: fnLimit, step: 0.2},
  phiRange: {label: "φ range", value: [0, 0], min: 0, max: TAU, step: TAU/100},
  radiusRange: {label: "r range", value: [0.01, fnLimit], min: 0.01, max: fnLimit, step: 0.2},
  showSegmentCoordinates: {label: "show segment", value: false},
  showFormula: {label: "formula", value: true},
  showIntegralX: {label: "show int x", value: false},
  showIntegralY: {label: "show int y", value: false},
  showIntegralR: {label: "show int r", value: false},
  showIntegralPhi: {label: "show int φ", value: false},
  showWalls: {label: "walls", value: true},
  cylinderRadius: {label: "cyl radius", value: 0, min: 0, max: fnLimit},
  // In theory, we should configure the vertical position of the disk and
  // compute the radius from that.  For "stability" reasons, however, we do
  // it the other way.
  diskRadius: {label: "disk radius", value: 0, min: 0, max: fnLimit},
};

type Decls = typeof schema;
type Values = { [K in keyof Decls]: Decls[K]["value"]; };

const base = Object.fromEntries(
  Object.entries(schema).map(([k, v]) => [k, v.value])
) as Values;

const configSteps: Partial<typeof base>[] = [
  {showFnGrid: false, xRange: [-0.4, -0.3], yRange: [-0.8, -0.9], showSegmentCoordinates: true},
  {showFnGrid: true, xRange: xyLimits, showIntegralX: true},
  {yRange: xyLimits, showIntegralY: true},
  {showSegmentCoordinates: false, showIntegralX: false, showIntegralY: false},
  {showContour: true},
  {showContour: false},
  {xRange: [0, fnLimit], yRange: [0, 0]},
  {polar: true},
  {phiRange: [0, TAU]},
  {showFnGrid: false, phiRange: [0.69*TAU, 0.70*TAU], radiusRange: [1.6, 1.7], showSegmentCoordinates: true},
  {radiusRange: [3.3, 3.4]},
  {radiusRange: [0.2, 0.3]},
  {radiusRange: [1.6, 1.7]},
  {showFnGrid: true, phiRange: [0, TAU], showIntegralPhi: true},
  {radiusRange: [0.01, fnLimit], showIntegralR: true},
  {showSegmentCoordinates: false, showIntegralPhi: false, showIntegralR: false, showFormula: false},
  {showWalls: false, phiRange: [0, 4]},
  {cylinderRadius: 1.2},
  {cylinderRadius: fnLimit},
  {cylinderRadius: 0},
  {diskRadius: 2},
  {diskRadius: fnLimit},
  {diskRadius: 0},
];

const clampList = (list: number[], min: number, max: number, minDelta = 0): number[] =>
  [min, ...list.filter(v => min + 1e-8 < v && v < max - 1e-8), Math.max(min + minDelta, max)];

const fromCylindric = (radial: number, phi: number, axial: number) =>
  new Vector3(radial * Math.cos(phi), radial * Math.sin(phi), axial);

const NormalDistribution2D: FC = () => {
  const {
    polar,
    showFnGrid,
    showContour,
    xRange: [xFrom, xTo],
    yRange: [yFrom, yTo],
    phiRange: [phiFrom, phiTo],
    radiusRange: [radiusFrom, radiusTo],
    showSegmentCoordinates,
    showFormula,
    showIntegralX, showIntegralY, showIntegralR, showIntegralPhi,
    showWalls,
    cylinderRadius: cylinderRadiusS,
    diskRadius: diskRadiusS,
  } = useControlsWithStepping("2D distribution", schema, configSteps) as Values;

  return (
    <Slide>
      <FnFormula {...{
        polar, showFormula, showSegmentCoordinates,
        showIntegralX, showIntegralY, showIntegralR, showIntegralPhi,
      }}/>
      <CylinderFormulas opacity={cylinderRadiusS === 0 ? 0 : 1}/>
      <Canvas>
        <OrbitControls enableRotate={false /* leave rotation to PresentationControls */}/>
        <ambientLight intensity={0.2} />
        <directionalLight intensity={1} color="#ccf" position={[-2, 0, 2]} />
        <color attach="background" args={["#002"]} />

        <PresentationControls
          global
          snap // just for temporary view adjustments
          azimuth={[-Math.PI, Math.PI]}
          polar={[-Math.PI/2, Math.PI/2]}
          speed={2}
        >
          <group rotation={[
            // Let the x/y plane appear horizontal (like paper on a desk) with the
            // viewer/the camera slightly elevated
            -0.40 * Math.PI,
            0,
            // ...and also a bit away from the y/z plane:
            -0.05 * Math.PI
          ]}>
            {polar
            ? <FnPolar {...{radiusFrom, radiusTo, phiFrom, phiTo, showFnGrid, showWalls, showSegmentCoordinates}}/>
            : <FnCartesian {...{xFrom, xTo, yFrom, yTo, showFnGrid, showWalls, showSegmentCoordinates}}/>
            }

            <ContourLines show={showContour}/>

            <TheCylinder radius={cylinderRadiusS}/>
            <TheDisk radius={diskRadiusS}/>

            <Coordinates polar={polar}/>
          </group>
        </PresentationControls>

      </Canvas>
    </Slide>
  )
};  

export default NormalDistribution2D;

const FnFormula: FC<{
  polar: boolean,
  showFormula: boolean,
  showIntegralX: boolean,
  showIntegralY: boolean,
  showSegmentCoordinates: boolean,
  showIntegralR: boolean,
  showIntegralPhi: boolean,
}> = (props) => (<>
      <style>{[
        ["intY", "magenta", props.showIntegralY],
        ["intX", "yellow", props.showIntegralX],
        ["fXY", "cyan", true],
        ["dX", "yellow", props.showSegmentCoordinates],
        ["dY", "magenta", props.showSegmentCoordinates],
        ["intR", "magenta", props.showIntegralR],
        ["intPhi", "yellow", props.showIntegralPhi],
        ["fR", "cyan", true],
        ["dPhi", "yellow", props.showSegmentCoordinates],
        ["dR", "magenta", props.showSegmentCoordinates],
      ].map(([className, color, flag]) => `
        .integral .${className} {
          color: ${color};
          opacity: ${flag ? 1 : 0};
          transition: opacity 0.5s;
        }
      `).join("")
      }</style>
      <Formula className="integral" style={{
        position: "absolute", zIndex: 2, top: 40, left: 60,
        opacity: props.showFormula ? 1 : 0,
        transition: "opacity 0.5s",
        fontSize: 45,
      }}
        math={props.polar ? String.raw`
          \;\;\;\,
          \htmlClass{intR}  {\int_0^\infty}
          \htmlClass{intPhi}{\int_0^\turn}
          \htmlClass{fR}    {\expon{-\oneHalf r^2}}
          \htmlClass{dPhi}  {\,r\;\d\phi}
          \htmlClass{dR}    {\;\d r}
        ` : String.raw`
          \htmlClass{intY}{\int_{-\infty}^{+\infty}}
          \htmlClass{intX}{\int_{-\infty}^{+\infty}}
          \htmlClass{fXY}{\expon{-\oneHalf(x^2+y^2)}}
          \htmlClass{dX}{\;\d x}
          \htmlClass{dY}{\;\d y}
        `}
      />
</>);

const CylinderFormulas: FC<{opacity: number}> = ({opacity}) => (
  <table style={{
    position: "absolute", zIndex: 2, top: 40, left: 60,
    opacity,
    transition: "opacity 0.5s",
  }}>
    <tbody>
      <tr>
        <td>height:</td>
        <td><Formula inline math="\bell r"/></td>
      </tr>
      <tr>
        <td>circumference:&nbsp;&nbsp;&nbsp;</td>
        <td><Formula inline math="\turn r"/></td>
      </tr>
    </tbody>
  </table>
);

const radiusStepsAll =
  // stepList({from: 0, to: fnLimit, step: 0.25});
  [0, .125, .25, .375, .5, .75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 3, 5];
const radiusGridSteps = stepList({from: 0, to: fnLimit, step: 0.5});

const phiStepsAll = stepList({from: 0, to: TAU, step: TAU/100});
const phiGridSteps = stepList({from: 0, to: TAU, step: TAU/24});

const FnPolar: FC<{
  radiusFrom: number, radiusTo: number,
  phiFrom: number, phiTo: number,
  showFnGrid: boolean, showWalls: boolean, showSegmentCoordinates: boolean,
}> = ({
  radiusFrom: radiusFromS, radiusTo: radiusToS,
  phiFrom: phiFromS, phiTo: phiToS,
  showFnGrid, showWalls, showSegmentCoordinates,
}) => {

  const radiusFrom = useMySpring(radiusFromS);
  const radiusTo = useMySpring(radiusToS);
  const radiusSteps = clampList(radiusStepsAll, radiusFrom, radiusTo, 0.05);

  const phiFrom = useMySpring(phiFromS);
  const phiTo = useMySpring(phiToS);
  const phiSteps = clampList(phiStepsAll, phiFrom, phiTo, TAU/500);

  const fromPolarAndI = (r: number, phi: number, i: number): Vector3 => fromCylindric(r, phi, i * fnR(r));

  return (<>
    <mesh>
      <surfaceGeometry args={[
        quadrangulate(radiusSteps, phiSteps, (r, phi) => fromCylindric(r, phi, fnR(r)))
      ]}/>
      <meshStandardMaterial color={"#8af"} side={DoubleSide}/>
    </mesh>
    {showFnGrid &&
      <group>
        {clampList(radiusGridSteps, radiusFrom, radiusTo, 1e-8).map(r => (
          <Line key={r} color="blue" points={
            phiSteps.map(phi =>
              fromCylindric(r, phi, fn(r, 0) + 1.5 * wireOffset)
            )
          }/>
        ))}
        {clampList(phiGridSteps, phiFrom, phiTo, 1e-8).map(phi => (
          <Line key={phi} color="blue" points={
            radiusSteps.map(r => fromCylindric(r, phi, fn(r, 0) + 1.5 * wireOffset))
          }/>
        ))}
      </group>
    }
    {showWalls &&
      <mesh>
        <surfaceGeometry args={[combineSurfaceGenerators(
          // radial walls
          quadrangulate(radiusSteps, [0, 1], (r, i) => fromPolarAndI(r, phiFrom, i)),
          quadrangulate(radiusSteps, [0, 1], (r, i) => fromPolarAndI(r, phiTo  , i)),
          // the "roof" (function surface) goes elsewhere so that we can use another material;
          // floor:
          quadrangulate([radiusFrom, radiusTo], phiSteps, (r, phi) => fromCylindric(r, phi, 0)),
          // inner and outer wall
          quadrangulate(phiSteps, [0, 1], (phi, i) => fromPolarAndI(radiusFrom, phi, i)),
          quadrangulate(phiSteps, [0, 1], (phi, i) => fromPolarAndI(radiusTo  , phi, i)),
        )]}/>
        <meshStandardMaterial color={"#666"} side={DoubleSide}/>
      </mesh>
    }
    {showSegmentCoordinates &&
      <group>
        {[radiusFrom, radiusTo].map(r => (
          <Line key={r} color="yellow" points={phiStepsAll.map(phi => fromCylindric(r, phi, 0))}/>
        ))}
        {[phiFrom, phiTo].map(phi => (
          <Line key={phi} color="magenta" points={
            [new Vector3(), fromCylindric(radiusStepsAll.at(-1)!, phi, 0)]
          }/>
        ))}
        <Line color="yellow" wireframe wireframeLinewidth={10} points={phiSteps.map(phi => fromCylindric(radiusTo, phi, 0))}/>
        <Line color="magenta" wireframe wireframeLinewidth={10} points={
          [fromCylindric(radiusFrom, phiTo, 0), fromCylindric(radiusTo, phiTo, 0)]
        }/>
        <Line color="cyan" wireframe wireframeLinewidth={10} points={
          [fromCylindric(radiusTo, phiTo, 0), fromCylindric(radiusTo, phiTo, fn(radiusTo, 0))]
        }/>
      </group>

    }
  </>);
};

const xyStepsAll = [
  ...radiusStepsAll.slice(1).map(x => -x).reverse(),
  ...radiusStepsAll
];

const FnCartesian: FC<{
  xFrom: number, xTo: number,
  yFrom: number, yTo: number,
  showFnGrid: boolean, showWalls: boolean, showSegmentCoordinates: boolean,
}> = ({
  xFrom: xFromS, xTo: xToS, yFrom: yFromS, yTo: yToS,
  showFnGrid, showWalls, showSegmentCoordinates,
}) => {
  
  const xFrom = useMySpring(xFromS);
  const xTo = useMySpring(xToS);
  const yFrom = useMySpring(yFromS);
  const yTo = useMySpring(yToS);

  const xSteps = clampList(xyStepsAll, xFrom, xTo, 0.05);
  const ySteps = clampList(xyStepsAll, yFrom, yTo, 0.05);

  const xyFnGridSteps = stepList({from: -fnLimit, to: fnLimit, step: 0.5});;

  return (<>
    <mesh>
      <surfaceGeometry args={[
        quadrangulate(xSteps, ySteps, (x, y) => new Vector3(x, y, fn(x, y)))
      ]}/>
      <meshStandardMaterial color={"#8af"} side={DoubleSide}/>
    </mesh>
    {showFnGrid &&
      <group visible={showFnGrid}>
      {clampList(xyFnGridSteps, xFrom, xTo, 0).map((x, i) => (
        <Line key={i} color="blue"
          points={ySteps.map(y => [x, y, fn(x, y) + 1.5 * wireOffset])}/>
      ))}

      {clampList(xyFnGridSteps, yFrom, yTo, 0).map((y, i) => (
        <Line key={i} color="blue"
          points={xSteps.map(x => [x, y, fn(x, y) + 1.5 * wireOffset])}/>
      ))}
      </group>
    }
    {showWalls &&
      <mesh>
        <surfaceGeometry args={[combineSurfaceGenerators(
          quadrangulate(xSteps, [0, 1], (x, i) => new Vector3(x, yFrom, i * fn(x, yFrom))),
          quadrangulate(xSteps, [0, 1], (x, i) => new Vector3(x, yTo  , i * fn(x, yTo  ))),

          quadrangulate([0, 1], ySteps, (i, y) => new Vector3(xFrom, y, i * fn(xFrom, y))),
          quadrangulate([0, 1], ySteps, (i, y) => new Vector3(xTo  , y, i * fn(xTo  , y))),

          ({addVertex, addQuadrangle}) => {
            const v0 = (x: number, y: number) => addVertex(new Vector3(x, y, 0 - wireOffset));
            addQuadrangle(v0(xFrom, yFrom), v0(xFrom, yTo), v0(xTo, yTo), v0(xTo, yFrom));
          },
        )]}/>
        <meshStandardMaterial color={"#666"} side={DoubleSide}/>
      </mesh>    
    }
    {showSegmentCoordinates &&
      <group>
        {[xFrom, xTo].map((x, i) => (
          <Line key={i} color="magenta" points={[[x, -coordLimit, 0], [x, coordLimit, 0]]}/>
        ))}
        {[yFrom, yTo].map((y, i) => (
          <Line key={i} color="yellow" points={[[-coordLimit, y, 0], [coordLimit, y, 0]]}/>
        ))}
        <Line color="yellow" wireframe wireframeLinewidth={10} points={[[xFrom, yFrom, 0], [xTo, yFrom, 0]]}/>
        <Line color="magenta" wireframe wireframeLinewidth={10} points={[[xTo, yFrom, 0], [xTo, yTo, 0]]}/>
        <Line color="cyan" wireframe wireframeLinewidth={10} points={[[xTo, yFrom, 0], [xTo, yFrom, fn(xTo, yFrom)]]}/>
      </group>
    }
  </>);
};

const inverseFn = (z: number): number =>
  Math.min(5, // avoid too large numbers for technical reasons
    Math.sqrt(-2 * Math.log(z))
  );

const ContourLines: FC<{show: boolean}> = ({show}) => {
  const height = useMySpring(show ? 1 : 0);
  return (<>
    {stepList({from: 0.05, to: 0.95, step: 0.05}).filter(z => z < height).map((z, i) => (
      <Circle key={i} color="#060"
        radius={inverseFn(z)} height={z + 1.5 * wireOffset}
      />
    ))}
  </>);
};

const TheCylinder: FC<{radius: number}> = ({radius}) => {
  const actualRadius = useMySpring(radius);  
  return (
    <mesh>
      <surfaceGeometry args={[quadrangulate(
        stepList({from: 0, to: TAU, step: TAU/100}),
        [0, fn(actualRadius, 0) - wireOffset],
        (phi: number, height: number) => fromCylindric(actualRadius, phi, height),
      )]}/>
      <meshStandardMaterial color={"red"} side={DoubleSide}/>
    </mesh>
  );
};

const TheDisk: FC<{radius: number}> = ({radius}) => {
  const actualRadius = useMySpring(radius);
  return (
    <mesh>
      <surfaceGeometry args={[({addVertex, addTriangle}) => {
        const z = fn(actualRadius, 0);
        const center = addVertex(new Vector3(0, 0, z));
        let prev = addVertex(new Vector3(actualRadius, 0, z));
        for (const phi of steps({from: TAU/100, to: TAU, step: TAU/100})) {
          const v = addVertex(fromCylindric(actualRadius, phi, z));
          addTriangle(prev, center, v);
          prev = v;
        }
      }]}/>
      <meshStandardMaterial color={"green"} side={DoubleSide}/>
    </mesh>
  );
};

const Coordinates: FC<{polar: boolean}> = ({polar}) => {
  const polarVisibility = useMySpring(polar ? 1 : 0);

  // coordinate line grid
  const xyCoordSteps = stepList({from: -coordLimit, to: coordLimit, step: 0.5});

  const radiusCoordSteps = stepList({from: 0, to: 5, step: 0.5});
  const phiCoordSteps = stepList({from: 0, to: TAU, step: TAU/24});

  const radiusStepsAll = stepList({from: 0, to: 5, step: 0.2});

  return (<>
    <group position={[0, 0, -wireOffset]}>
      <Axis points={[[-coordLimit, 0, 0], [coordLimit, 0, 0]]}/>
      <Axis points={[[0, -coordLimit, 0], [0, coordLimit, 0]]}/>
      <Axis points={[[0, 0, -coordLimit], [0, 0, coordLimit]]}/>
    </group>

    <group visible={polarVisibility !== 1} position={[0, 0, -wireOffset]}>
      {xyCoordSteps.map(x => (
        <Line key={x} transparent opacity={1-polarVisibility} color="green" points={[[x, -coordLimit], [x, coordLimit, 0]]} />
      ))}
      {xyCoordSteps.map(y => (
        <Line key={y} transparent opacity={1-polarVisibility} color="green" points={[[-coordLimit, y, 0], [coordLimit, y, 0]]} />
      ))}
    </group>

    <group visible={polarVisibility !== 0} position={[0, 0, -wireOffset]}>
      {radiusCoordSteps.map(r => (
        <Circle key={r} transparent opacity={polarVisibility} color="green" radius={r} height={0}/>
      ))}
      {phiCoordSteps.map(phi => (
        <Line key={phi} transparent opacity={polarVisibility} color="green" points={[
          new Vector3(),
          new Vector3(radiusStepsAll.at(-1)! * Math.cos(phi), radiusStepsAll.at(-1)! * Math.sin(phi), 0)
        ]}/>
      ))}
    </group>
  </>);
};

const Axis: FC<LineProps> = (props) => (
  <Line {...{color: "#0a0", ...props}} wireframe wireframeLinewidth={10}/>
);

const Circle: FC<
  {radius: number, height: number} & Omit<Parameters<typeof Line>[0], "points">
> = ({radius, height, ...more}) => (
  <Line
    points={stepList({from: 0, to: TAU, step: TAU/100}).map(phi => {
      const x = radius * Math.cos(phi);
      const y = radius * Math.sin(phi);
      return [x, y, height];
    })}
    {...more}
  />
);
