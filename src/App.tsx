import { FC } from 'react';
import './App.css'
import GaussianScaling from './GaussianScaling';

const App: FC = () => {
  return (
    <div className="App">
      <GaussianScaling/>
    </div>
  );
};

export default App;

// It can easily happen that you want to navigate within the slideshow
// but you accidentially navigate away from it.  This can be annoying.
// To avoid this, enable the confirmation question.
// OTOH, the confirmation question can also be annoying...
// window.onbeforeunload = () => confirm("Really leave this page?")
