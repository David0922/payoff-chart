import { Component, Signal, createSignal } from 'solid-js';

import {
  Option,
  OptionType,
  OrderType,
  Position,
  Security,
  SecurityType,
  Stock,
} from '../lib/security';
import CheckBox from '../ui/CheckBox';

const SecurityComp: Component<{
  security: Security;
  update: (oldId: number, updated: Security) => void;
  delete: () => void;
}> = props => {
  const [type, setType] = createSignal<SecurityType>(props.security.type);
  const [position, setPosition] = createSignal<Position>(
    props.security.position
  );
  const [orderType, setOrderType] = createSignal<OrderType>(
    props.security instanceof Stock ? props.security.orderType : 'limit'
  );
  const [price, setPrice] = createSignal<number>(
    (() => {
      if (props.security instanceof Stock) {
        return props.security.price;
      } else if (props.security instanceof Option) {
        return props.security.strikePrice;
      } else {
        return 0;
      }
    })()
  );
  const [optionType, setOptionType] = createSignal<OptionType>(
    props.security instanceof Option ? props.security.optionType : 'call'
  );
  const [premium, setPremium] = createSignal<number>(
    props.security instanceof Option ? props.security.premium : 0
  );
  const [shares, setShares] = createSignal(props.security.shares);
  const [active, setActive] = createSignal(props.security.active);

  const update = () => {
    if (type() === 'stock') {
      props.update(
        props.security.id,
        new Stock(position(), price(), orderType(), shares(), active())
      );
    } else if (type() === 'option') {
      props.update(
        props.security.id,
        new Option(
          position(),
          optionType(),
          price(),
          premium(),
          shares(),
          active()
        )
      );
    }
  };

  const btnAttr = <T,>(labels: T[], [a, s]: Signal<T>) =>
    labels.map((label): [string, () => void] => [
      label as string,
      () => {
        if (a() === label) return;
        s(label as any);
        update();
      },
    ]);

  const activeCls = 'flex flex-col gap-4';
  const inactiveCls = activeCls + ' bg-neutral-100';

  return (
    <div class={active() ? activeCls : inactiveCls}>
      <div class='flex gap-4'>
        <div class='grow'>
          <CheckBox
            btnAttr={btnAttr<SecurityType>(
              ['stock', 'option'],
              [type, setType]
            )}
            selected={type()}
          />
        </div>
        <button
          class='bg-neutral-50 hover:bg-neutral-200 text-neutral-800 border border-neutral-400 px-2.5 material-symbols-outlined'
          onclick={() => {
            setActive(!active());
            update();
          }}
        >
          {active() ? 'toggle_on' : 'toggle_off'}
        </button>
        <button
          class='text-red-800 bg-red-50 border border-red-400 hover:bg-red-100 px-2.5 material-symbols-outlined'
          onclick={props.delete}
        >
          close
        </button>
      </div>
      <div class='flex gap-4'>
        <div class='grow'>
          <CheckBox
            btnAttr={btnAttr<Position>(
              ['long', 'short'],
              [position, setPosition]
            )}
            selected={position()}
          />
        </div>
        <div class='grow'>
          {type() === 'stock' ? (
            <CheckBox
              btnAttr={btnAttr<OrderType>(
                ['limit', 'stop'],
                [orderType, setOrderType]
              )}
              selected={orderType()}
            />
          ) : (
            <CheckBox
              btnAttr={btnAttr<OptionType>(
                ['call', 'put'],
                [optionType, setOptionType]
              )}
              selected={optionType()}
            />
          )}
        </div>
      </div>
      <div class='flex gap-4 items-center'>
        <label for={`shares-${props.security.id}`}>shares</label>
        <input
          type='number'
          id={`shares-${props.security.id}`}
          class='bg-neutral-100 grow w-4 px-4 py-2'
          value={shares()}
          onclick={e => e.currentTarget.select()}
          onchange={e => {
            setShares(Number(e.target.value));
            update();
          }}
        />
      </div>
      <div class='flex gap-4 items-center'>
        {type() === 'stock' && (
          <>
            <label for={`price-${props.security.id}`}>price</label>
            <input
              type='number'
              id={`price-${props.security.id}`}
              class='bg-neutral-100 grow w-4 px-4 py-2'
              value={price()}
              onclick={e => e.currentTarget.select()}
              onchange={e => {
                setPrice(Number(e.target.value));
                update();
              }}
            />
          </>
        )}
        {type() === 'option' && (
          <>
            <label for={`premium-${props.security.id}`}>premium</label>
            <input
              type='number'
              id={`premium-${props.security.id}`}
              class='bg-neutral-100 grow w-4 px-4 py-2'
              value={premium()}
              onclick={e => e.currentTarget.select()}
              onchange={e => {
                setPremium(Number(e.target.value));
                update();
              }}
            />
            <label for={`strikePrice-${props.security.id}`}>strike price</label>
            <input
              type='number'
              id={`strikePrice-${props.security.id}`}
              class='bg-neutral-100 grow w-4 px-4 py-2'
              value={price()}
              onclick={e => e.currentTarget.select()}
              onchange={e => {
                setPrice(Number(e.target.value));
                update();
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SecurityComp;
