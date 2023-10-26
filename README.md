setup

```bash
yarn
```

run locally

```bash
yarn build
yarn start
```

containerize

```bash
docker build -t payoff-chart .
docker run --rm -it -p 8080:80 payoff-chart
```
