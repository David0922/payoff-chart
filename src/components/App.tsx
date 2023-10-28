import { Component } from 'solid-js';

import { Option, Security, StockStopOrder } from '../lib/security';
import PayoffChart from './PayoffChart';

const App: Component = () => {
  const strikePrice = 96;
  const callPremium = 4.18;
  const putPremium = 3.7;

  const securities: Security[] = [
    new Option('call', strikePrice, callPremium, 'short'),
    new Option('put', strikePrice, putPremium, 'short'),
    new StockStopOrder(strikePrice + callPremium, 'long'),
    new StockStopOrder(strikePrice - putPremium, 'short'),
  ];

  return (
    <div class='flex h-screen'>
      {/* <div class='bg-neutral-200 overflow-y-auto w-96'></div> */}
      <div class='flex grow items-center'>
        <PayoffChart
          securities={securities}
          comb={true}
          combTitle='AMD'
          targetGains={[0, 4.5, 5]}
        />
      </div>
    </div>
  );
};

export default App;
