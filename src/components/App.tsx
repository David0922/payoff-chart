import { Component, createSignal } from 'solid-js';

import { Option, Security, Stock } from '../lib/security';
import PayoffChart from './PayoffChart';
import SecurityComp from './SecurityComp';

const App: Component = () => {
  const [title, setTitle] = createSignal('');
  const [x, setX] = createSignal<number[]>([]);
  const [y, setY] = createSignal<number[]>([0]);

  const strikePrice = 100;
  const callPremium = 5;
  const putPremium = 5;

  const [securities, setSecurities] = createSignal<Security[]>([
    new Option('short', 'call', strikePrice, callPremium),
    new Option('short', 'put', strikePrice, putPremium),
    // new Stock('long', strikePrice + callPremium, 'stop'),
    // new Stock('short', strikePrice - putPremium, 'stop'),
  ]);

  const addSecurity = () =>
    setSecurities([...securities(), new Stock('long', 0, 'limit')]);

  const updateSecurity = (oldId: number, updated: Security) =>
    setSecurities(
      securities().map(security => (security.id === oldId ? updated : security))
    );

  const deleteSecurity = (id: number) =>
    setSecurities(securities().filter(security => security.id !== id));

  return (
    <div class='flex gap-4 h-screen p-4'>
      <div class='flex flex-col gap-4 w-96'>
        <div class='flex gap-4'>
          <input
            class='bg-neutral-100 px-4 py-2 w-4 grow'
            placeholder='label'
            onchange={e => setTitle(e.target.value)}
          />
          <input
            class='bg-neutral-100 px-4 py-2 w-4 grow'
            placeholder='x'
            onchange={e =>
              setX(
                e.target.value
                  .split(' ')
                  .filter(x => x)
                  .map(Number)
                  .filter(num => !isNaN(num))
              )
            }
          />
          <input
            class='bg-neutral-100 px-4 py-2 w-4 grow'
            placeholder='y'
            onchange={e =>
              setY(
                e.target.value
                  .split(' ')
                  .filter(y => y)
                  .map(Number)
                  .filter(num => !isNaN(num))
              )
            }
          />
        </div>
        <div class='flex flex-col gap-4 grow overflow-y-auto'>
          {securities().map((security, idx) => (
            <>
              {idx > 0 && (
                <div class='border-b border-dashed border-neutral-400' />
              )}
              <SecurityComp
                security={security}
                update={updateSecurity}
                delete={() => deleteSecurity(security.id)}
              />
            </>
          ))}
        </div>

        <button
          class='border border-neutral-400 bg-neutral-50 hover:bg-neutral-100 py-2 material-symbols-outlined'
          onclick={addSecurity}>
          add
        </button>
      </div>
      <div class='flex grow items-center'>
        <PayoffChart
          securities={securities}
          comb={true}
          combTitle={title}
          x={x}
          y={y}
        />
      </div>
    </div>
  );
};

export default App;
