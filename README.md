source code for https://payoff-chart.mofu.dev

install dependencies

```bash
pnpm install
```

run locally

```bash
pnpm build
pnpm start
```

containerize

```bash
docker build -t payoff-chart .
docker run --rm -it -p 8080:80 payoff-chart
```
