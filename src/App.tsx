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

window.onbeforeunload = () => confirm("Really leave this page?")
