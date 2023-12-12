import { ComponentPropsWithoutRef, FC } from 'react';
import { useControls } from "leva";
import TeX from "@matejmazur/react-katex";

// TODO get the settings from a react context instead of hard-wiring them here
const useTeXSettings = () => {
  const {
    useEPower, useSmallExp, useTau,
  } = useControls("notation", {
    useEPower: {label: "use e^", value: false},
    useSmallExp: {label: "small exp", value: false, render: (get) => get("notation.useEPower")},
    useTau: {label: "use τ", value: false},
  });

  return {
    strict: false,
    trust: true,
    macros: {
      '\\highlight': "\\htmlClass{highlight}",
      '\\unhighlight': "\\htmlClass{unhighlight}",
      '\\expon': useEPower
        ? (useSmallExp ? '\\mathrm{e}^{#1}' : '\\mathrm{e}^{\\normalsize#1}')
        : '\\exp\\!\\paren(){#1}',
      '\\turn': useTau ? '\\tau' : '{2\\pi}',
      '\\piOrTau': useTau ? '\\tau' : '\\pi',
      '\\oneHalf': '{\\scriptsize\\frac{1}{2}}',
      '\\d': '\\mathrm{d}',
      '\\bell': '\\expon{-\\oneHalf {#1}^2}',
      '\\intR': '\\int_{-\\infty}^{+\\infty}#2\\d{#1}',
      '\\intRad': '\\int_0^\\infty#1\\d{r}',
      '\\intPhi': '\\int_0^\\turn#1\\d\\phi',
      '\\paren': '{\\left#1{#3}\\right#2}',
      }
  };
};

export const Formula: FC<
  { display?: string | false; inline?: boolean; } &
  ComponentPropsWithoutRef<typeof TeX>
> = ({ display = "white", inline, style = {}, ...more }) => (
  <TeX block={!inline} settings={useTeXSettings()}
    style={{
      visibility: display ? "visible" : "hidden",
      ...display ? { color: display } : {},
      ...style
    }}
    {...more} />
);
