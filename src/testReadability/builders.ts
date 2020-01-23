import { Item, Order, TaxRate } from "./taxCalculator";

/**
 * Fluent Builder for Order objects
 */
export class OrderBuilder {

  private orderId:number = 10000;
  private trackingId:number = 123456;
  private originationId:string = "orig-id";
  private tags:string[] = [];
  private items:Item[] = [];

  public withOrderId(orderId:number): OrderBuilder {
    this.orderId = orderId;
    return this;
  }

  public withTrackingId(trackingId:number): OrderBuilder {
    this.trackingId = trackingId;
    return this;
  }

  public withOriginationId(originationId:string): OrderBuilder {
    this.originationId = originationId;
    return this;
  }

  public addTag(tag:string) {
    this.tags.push(tag);
    return this;
  }

  public withTags(tags:string[]) {
    this.tags = tags;
    return this;
  }

  public addItems(...item:Item[]): OrderBuilder {
    this.items = this.items.concat(item);
    return this;
  }

  public addItem(): ItemBuilder {
    return new ItemBuilder(this);
  }

  public build(): Order {
    let order = new Order();

    order.orderId = this.orderId;
    order.trackingId = this.trackingId;
    order.originationId = this.originationId;
    order.tags = this.tags;
    order.items = this.items;

    return order;
  }
}

/**
 * Fluent Builder for Item objects
 */
export class ItemBuilder {

  constructor(parent?: OrderBuilder) {
    this.parent = parent;
  }

  private parent: OrderBuilder | undefined;

  private itemId: number = 10000;
  private sku: string = "def-sku-G123-AAA";
  private name: string = "Test Item";
  private weight: number = 500;
  private price: number = 900;
  private combinable: boolean = false;
  private taxExempt: boolean = false;

  public withItemId(itemId: number): ItemBuilder {
    this.itemId = itemId;
    return this;
  }

  public withSku(sku: string): ItemBuilder {
    this.sku = sku;
    return this;
  }

  public withPrice(price: number): ItemBuilder {
    this.price = price;
    return this;
  }

  public withTaxExempt(taxExempt: boolean): ItemBuilder {
    this.taxExempt = taxExempt;
    return this;
  }

  public withCombinable(combinable: boolean): ItemBuilder {
    this.combinable = combinable;
    return this;
  }

  public build(): Item {
    if(!this.parent) {
      return this.createItem();
    } else {
      throw new Error("You are using as a nested builder, call add()")
    }
  }

  public add(): OrderBuilder {
    if(!this.parent) {
      throw new Error("add() can only be used on nested Item creation!")
    }
    this.parent.addItems(this.createItem());
    return this.parent;
  }

  private createItem(): Item {
    const item = new Item();
    item.itemId = this.itemId;
    item.sku = this.sku;
    item.name = this.name;
    item.weight = this.weight;
    item.price = this.price;
    item.combinable = this.combinable;
    item.taxExempt = this.taxExempt;
    return item;
  }
}

/**
 * Fluent Builder for TaxRate objects 
 */
export class TaxRateBuilder {

  private rate:number = 0;
  private name:string = "Some tax rate";

  public withRate(rate:number): TaxRateBuilder {
    this.rate = rate;
    return this;
  }

  public withName(name:string): TaxRateBuilder {
    this.name = name;
    return this;
  }

  public build() {
    let taxRate = new TaxRate();
    taxRate.rate = this.rate;
    taxRate.name = this.name;
    return taxRate;
  }
}