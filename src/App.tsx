import { Component } from 'solid-js';

import PayoffChart from './PayoffChart';
import { Option, Security, TriggeredStock } from './security';

const App: Component = () => {
  const strikePrice = 120;
  const callPremium = 4.46;
  const putPremium = 4.54;

  const securities: Security[] = [
    new Option('call', strikePrice, callPremium, 'short'),
    new Option('put', strikePrice, putPremium, 'short'),
    new TriggeredStock(strikePrice + callPremium, 'long'),
    new TriggeredStock(strikePrice - putPremium, 'short'),
  ];

  return (
    <div class='flex h-screen'>
      {/* <div class='bg-neutral-200 overflow-y-auto w-96'></div> */}
      <div class='flex grow items-center'>
        <PayoffChart securities={securities} comb={true} combTitle='cqw' />
      </div>
    </div>
  );
};

export default App;
