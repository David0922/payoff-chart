import Chart from 'chart.js/auto';
import { Component, createEffect } from 'solid-js';

import { Comb, Security, flattenX } from '../lib/security';
import {
  binarySearch,
  distinctColors,
  removeDuplicatesAndSort,
} from '../lib/utils';

const PayoffChart: Component<{
  securities: Security[];
  comb: boolean;
  combTitle: string;
  targetGains: number[];
}> = props => {
  let canvas: HTMLCanvasElement;

  const toGraph: Security[] = props.comb
    ? [...props.securities, new Comb(props.securities, props.combTitle)]
    : props.securities;

  createEffect(() => {
    const ctx = canvas.getContext('2d');

    const inf = 1000000;
    let prices = flattenX(toGraph);

    for (let security of toGraph) {
      const x = [0, ...security.x(), inf];

      for (let i = 0; i < x.length - 1; ++i) {
        for (let targetGain of props.targetGains) {
          const [priceAtZero, found] = binarySearch(
            x[i],
            x[i + 1],
            targetGain,
            (price: number) => security.gainAtPrice(price)
          );

          if (found) prices.push(priceAtZero);
        }
      }
    }

    prices = removeDuplicatesAndSort(prices);
    prices = [
      prices[0] - prices[prices.length >> 1] * 0.01,
      ...prices,
      prices[prices.length - 1] + prices[prices.length >> 1] * 0.01,
    ];

    const colors = distinctColors(toGraph.length);

    new Chart(ctx, {
      type: 'line',
      data: {
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
      },
      options: {
        scales: {
          x: {
            type: 'linear',
          },
          y: {
            beginAtZero: true,
            type: 'linear',
          },
        },
      },
    });
  });

  return <canvas ref={canvas} />;
};

export default PayoffChart;
