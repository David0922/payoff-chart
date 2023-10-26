export type Position = 'long' | 'short';

export interface Security {
  position: Position;

  gainAtPrice(price: number): number;
  x(): number[];
  label(): string;
}

function mul(position: Position) {
  return position === 'long' ? 1 : -1;
}

export function flattenX(securities: Security[]): number[] {
  return [...new Set(securities.map(security => security.x()).flat())].sort(
    (a, b) => a - b
  );
}

export class Stock implements Security {
  price: number;
  position: Position;

  constructor(price: number, position: Position) {
    this.price = price;
    this.position = position;
  }

  gainAtPrice(stockPrice: number): number {
    return (stockPrice - this.price) * mul(this.position);
  }

  x(): number[] {
    return [this.price];
  }

  label(): string {
    return `${this.position} stock, price: $${this.price}`;
  }
}

export class TriggeredStock implements Security {
  triggerPrice: number;
  position: Position;

  constructor(triggerPrice: number, position: Position) {
    this.triggerPrice = triggerPrice;
    this.position = position;
  }

  gainAtPrice(stockPrice: number): number {
    return Math.max(0, (stockPrice - this.triggerPrice) * mul(this.position));
  }

  x(): number[] {
    return [this.triggerPrice];
  }

  label(): string {
    return `${this.position} stock, trigger price: $${this.triggerPrice}`;
  }
}

export type OptionType = 'call' | 'put';

export class Option implements Security {
  type: OptionType;
  strikePrice: number;
  premium: number;
  breakEven: number;
  position: Position;

  constructor(
    type: OptionType,
    strikePrice: number,
    premium: number,
    position: Position
  ) {
    this.type = type;
    this.strikePrice = strikePrice;
    this.premium = premium;
    this.position = position;
  }

  optionMul(): number {
    return this.type === 'call' ? 1 : -1;
  }

  gainAtPrice(stockPrice: number): number {
    return (
      (Math.max(0, (stockPrice - this.strikePrice) * this.optionMul()) -
        this.premium) *
      mul(this.position)
    );
  }

  x(): number[] {
    return [
      this.strikePrice,
      this.strikePrice + this.premium * this.optionMul(),
    ];
  }

  label(): string {
    return `${this.position} ${this.type}, strike: ${this.strikePrice}, premium: ${this.premium}`;
  }
}

export class Comb implements Security {
  securities: Security[];
  position: Position = 'long';
  title: string;

  constructor(securities: Security[], label) {
    this.securities = securities;
    this.title = label;
  }

  gainAtPrice(stockPrice: number): number {
    let res = 0;

    for (const security of this.securities)
      res += security.gainAtPrice(stockPrice);

    return res;
  }

  x(): number[] {
    return flattenX(this.securities);
  }

  label(): string {
    return this.title;
  }
}
