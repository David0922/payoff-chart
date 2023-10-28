import { removeDuplicatesAndSort } from './utils';

export type SecurityType = 'stock' | 'option' | 'comb';
export type Position = 'long' | 'short';
export type OrderType = 'limit' | 'stop';
export type OptionType = 'call' | 'put';

let id = 0;

function newId() {
  return ++id;
}

export interface Security {
  id: number;
  type: SecurityType;
  position: Position;
  active: boolean;

  gainAtPrice(price: number): number;
  x(): number[];
  label(): string;
}

function mul(position: Position) {
  return position === 'long' ? 1 : -1;
}

export function flattenX(securities: Security[]): number[] {
  return removeDuplicatesAndSort(
    securities
      .filter(security => security.active)
      .map(security => security.x())
      .flat()
  );
}

export class Stock implements Security {
  id: number;
  type: SecurityType;
  orderType: OrderType;
  price: number;
  position: Position;
  active: boolean;

  constructor(
    position: Position,
    price: number,
    orderType: OrderType = 'limit',
    active = true
  ) {
    this.id = newId();
    this.type = 'stock';
    this.orderType = orderType;
    this.price = price;
    this.position = position;
    this.active = active;
  }

  gainAtPrice(stockPrice: number): number {
    if (!this.active) return 0;
    else if (this.orderType === 'limit')
      return (stockPrice - this.price) * mul(this.position);
    else if (this.orderType === 'stop')
      return Math.max(0, (stockPrice - this.price) * mul(this.position));
  }

  x(): number[] {
    return [this.active ? this.price : 0];
  }

  label(): string {
    return `${this.position} stock, ${this.orderType} order, price: $${this.price}`;
  }
}

export class Option implements Security {
  id: number;
  type: SecurityType;
  optionType: OptionType;
  strikePrice: number;
  premium: number;
  breakEven: number;
  position: Position;
  active: boolean;

  constructor(
    position: Position,
    optionType: OptionType,
    strikePrice: number,
    premium: number,
    active = true
  ) {
    this.id = newId();
    this.type = 'option';
    this.optionType = optionType;
    this.strikePrice = strikePrice;
    this.premium = premium;
    this.position = position;
    this.active = active;
  }

  optionMul(): number {
    return this.optionType === 'call' ? 1 : -1;
  }

  gainAtPrice(stockPrice: number): number {
    return this.active
      ? (Math.max(0, (stockPrice - this.strikePrice) * this.optionMul()) -
          this.premium) *
          mul(this.position)
      : 0;
  }

  x(): number[] {
    return this.active
      ? [this.strikePrice, this.strikePrice + this.premium * this.optionMul()]
      : [];
  }

  label(): string {
    return `${this.position} ${this.optionType}, strike: ${this.strikePrice}, premium: ${this.premium}`;
  }
}

export class Comb implements Security {
  id: number;
  type: SecurityType;
  securities: Security[];
  position: Position = 'long';
  title: string;
  active: boolean;

  constructor(securities: Security[], label: string, active = true) {
    this.id = newId();
    this.type = 'comb';
    this.securities = securities;
    this.title = label;
    this.active = active;
  }

  gainAtPrice(stockPrice: number): number {
    if (!this.active) return 0;

    let res = 0;

    for (const security of this.securities)
      if (security.active) res += security.gainAtPrice(stockPrice);

    return res;
  }

  x(): number[] {
    return this.active ? flattenX(this.securities) : [];
  }

  label(): string {
    return this.title;
  }
}
