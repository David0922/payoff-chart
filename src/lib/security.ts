import { removeDuplicatesAndSort } from './utils';

export type SecurityType = 'stock' | 'stock (stop order)' | 'option' | 'comb';
export type Position = 'long' | 'short';

export interface Security {
  type: SecurityType;
  position: Position;

  gainAtPrice(price: number): number;
  x(): number[];
  label(): string;
}

function mul(position: Position) {
  return position === 'long' ? 1 : -1;
}

export function flattenX(securities: Security[]): number[] {
  return removeDuplicatesAndSort(
    securities.map(security => security.x()).flat()
  );
}

export class Stock implements Security {
  type: SecurityType;
  price: number;
  position: Position;

  constructor(price: number, position: Position) {
    this.type = 'stock';
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

export class StockStopOrder implements Security {
  type: SecurityType;
  triggerPrice: number;
  position: Position;

  constructor(triggerPrice: number, position: Position) {
    this.type = 'stock (stop order)';
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
  type: SecurityType;
  optionType: OptionType;
  strikePrice: number;
  premium: number;
  breakEven: number;
  position: Position;

  constructor(
    optionType: OptionType,
    strikePrice: number,
    premium: number,
    position: Position
  ) {
    this.type = 'option';
    this.optionType = optionType;
    this.strikePrice = strikePrice;
    this.premium = premium;
    this.position = position;
  }

  optionMul(): number {
    return this.optionType === 'call' ? 1 : -1;
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
    return `${this.position} ${this.optionType}, strike: ${this.strikePrice}, premium: ${this.premium}`;
  }
}

export class Comb implements Security {
  type: SecurityType;
  securities: Security[];
  position: Position = 'long';
  title: string;

  constructor(securities: Security[], label: string) {
    this.type = 'comb';
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
