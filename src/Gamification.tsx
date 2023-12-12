import { OrbitControls, PresentationControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FC, useCallback } from 'react';
import TAU from './TAU';
import { Slide } from './SlideShow';
import { Buzzer } from './Buzzer';

export const Gamification: FC = () => (
  <Slide>
    <Canvas>
      <OrbitControls enableRotate={false /* leave rotation to PresentationControls */} />
      <ambientLight intensity={0.2} />
      <directionalLight intensity={1} color="#ccf" position={[-2, 0, 2]} />
      <directionalLight intensity={0.3} color="#fff" position={[5, 5, 1]} />
      <color attach="background" args={["#002"]} />

      <PresentationControls
        global
        snap // just for temporary view adjustments
        azimuth={[-Math.PI, Math.PI]}
        polar={[-Math.PI / 2, Math.PI / 2]}
        speed={2}
      >
        <group rotation={[
          // Let the x/y plane appear almost horizontal (like paper on a desk)
          -.9 * TAU / 4,
          0,
          // ...and also a bit away from the y/z plane:
          -.8 * TAU / 8
        ]}>

          <Buzzer onPress={useCallback(() => {
            const audioCtx = new window.AudioContext();
            const oscillator = audioCtx.createOscillator();
            oscillator.type = "square";
            oscillator.frequency.setValueAtTime(50, audioCtx.currentTime);
            oscillator.connect(audioCtx.destination);
            oscillator.start();
            setTimeout(() => oscillator.stop(), 500);
          }, [])} />

        </group>
      </PresentationControls>
    </Canvas>
  </Slide>
);
