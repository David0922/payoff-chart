import Chart from 'chart.js/auto';
import { Component, createEffect } from 'solid-js';

import { Comb, Security, flattenX } from './security';

const PayoffChart: Component<{
  securities: Security[];
  comb: boolean;
  combTitle: string;
}> = props => {
  const randomColor = () =>
    '#' + Math.floor(Math.random() * ((1 << 24) - 1)).toString(16);

  let canvas: HTMLCanvasElement;

  const toGraph: Security[] = [
    ...props.securities,
    props.comb && new Comb(props.securities, props.combTitle),
  ];

  createEffect(() => {
    const ctx = canvas.getContext('2d');

    const x = flattenX(toGraph);
    const prices = [x[0] - 10, ...x, x[x.length - 1] + 10];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: prices,
        datasets: toGraph.map((security, idx) => {
          const isComb = props.comb && idx === toGraph.length - 1;

          return {
            label: security.label(),
            data: prices.map(price => security.gainAtPrice(price)),
            borderColor: isComb ? 'red' : randomColor(),
            borderWidth: isComb ? 2 : 1,
            borderDash: isComb ? [] : [5, 2],
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
