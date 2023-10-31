import Chart, { ChartItem, ChartType } from 'chart.js/auto';
import { Accessor, Component, createEffect } from 'solid-js';

import { Comb, Security, flattenX } from '../lib/security';
import {
  binarySearch,
  distinctColors,
  removeDuplicatesAndSort,
} from '../lib/utils';

class ChartSingleton {
  static instance: Chart;

  private constructor() {}

  public static init(ctx: ChartItem, type: ChartType) {
    if (!ChartSingleton.instance) {
      ChartSingleton.instance = new Chart(ctx, {
        type,
        data: { datasets: [] },
      });
    }
  }

  public static getInstance(): Chart {
    return ChartSingleton.instance;
  }
}

const securitiesX = (
  securities: Security[],
  x: number[],
  y: number[]
): number[] => {
  const inf = 1000000;
  let prices = [...x, ...flattenX(securities)];

  for (let security of securities) {
    const sx = [0, ...security.x(), inf];

    for (let i = 0; i < sx.length - 1; ++i) {
      for (let targetGain of y) {
        const [priceAtZero, found] = binarySearch(
          sx[i],
          sx[i + 1],
          targetGain,
          (price: number) => security.gainAtPrice(price)
        );

        if (found) prices.push(priceAtZero);
      }
    }
  }

  prices = removeDuplicatesAndSort(prices);

  const margin = prices[prices.length >> 1] * 0.01;

  return [prices[0] - margin, ...prices, prices[prices.length - 1] + margin];
};

const PayoffChart: Component<{
  securities: Accessor<Security[]>;
  comb: boolean;
  combTitle: Accessor<string>;
  x: Accessor<number[]>;
  y: Accessor<number[]>;
}> = props => {
  let canvas: HTMLCanvasElement;

  createEffect(() => {
    const ctx = canvas.getContext('2d');
    ChartSingleton.init(ctx, 'line');

    const chart = ChartSingleton.getInstance();

    const activeSecurities = props
      .securities()
      .filter(security => security.active);

    const toGraph =
      props.comb && activeSecurities.length > 1
        ? [...activeSecurities, new Comb(activeSecurities, props.combTitle())]
        : activeSecurities;

    const colors = distinctColors(toGraph.length);
    const prices = securitiesX(toGraph, props.x(), props.y());

    chart.data = {
      labels: prices,
      datasets: toGraph.map((security, idx) => {
        const isComb = props.comb && idx === toGraph.length - 1;

        return {
          label: security.label(),
          data: prices.map(price => security.gainAtPrice(price)),
          borderColor: colors[idx],
          borderWidth: isComb ? 2 : 1,
          borderDash: isComb ? [] : [10, 8],
        };
      }),
    };

    chart.options = {
      scales: {
        x: {
          type: 'linear',
        },
        y: {
          beginAtZero: true,
          type: 'linear',
        },
      },
    };

    chart.update('none');
  });

  return <canvas ref={canvas} />;
};

export default PayoffChart;
