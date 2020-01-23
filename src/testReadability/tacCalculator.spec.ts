import { Item, Order, TaxCalculator, TaxRate } from "./taxCalculator";
import { OrderBuilder, TaxRateBuilder, ItemBuilder } from "./builders";

/**
 * Tests of the Calculator
 * - includes BAD tests
 * - not exhaustive, just examples
 */
describe('TaxCalculator', () => {

  /**
   * Here's a BAD test that Violated Chekhov's Gun!
   */
  it('should calculate tax on a single order', () => {

    let calculator = new TaxCalculator();

    const rate = {
      name: "WA State Sales Tax",
      rate: 10.1
    };

    const order = {
      orderId: 84242,
      trackingId: 1929781,
      originationId: 'tlq-19973-a76',
      tags: [],
      items: [
        {
          itemId: 198219,
          sku: 'BLK-MED-G123-GUC',
          name: 'socks',
          weight: 554,
          price: 999,
          combinable: false,
          taxExempt: false
        }]
      };

      const tax = calculator.calulate(order,[rate]);

      expect(tax).toBe(101);
  });

  /**
   * Here's a BAD test that has Hidden Oracles!
   */
  it('should calculate tax on a single order, hidden oracle', () => {

    let calculator = new TaxCalculator();

    const order = getOrder();
    const rate = getRate();

    const tax = calculator.calulate(order,[rate]);

    expect(tax).toBe(101);
  });

  /**
   * Here's a GOOD test that uses Fluent Builders
   */
  it('should calculate tax on a single order, with Fluent Builders', () => {

    let calculator = new TaxCalculator();

    let rate = new TaxRateBuilder()
      .withRate(10.1)
      .build();

    let order = new OrderBuilder()
      .addItems(
        new ItemBuilder().withPrice(999).build())
      .build()

    const tax = calculator.calulate(order,[rate]);

    expect(tax).toBe(101);
  });

  /**
   * Here a GOOD test that uses Fluent Builders
   */
  it('should calculate tax with multiple items, multiple rates', () => {

    let calculator = new TaxCalculator();

    let rates = [
      new TaxRateBuilder().withRate(10).build(),
      new TaxRateBuilder().withRate(6).build()
    ];

    let order = new OrderBuilder()
      .addItem().withPrice(400).add()
      .addItem().withPrice(500).add()
      .build();

    let tax = calculator.calulate(order,rates);

    // (400 + 500) * (10 + 6) / 100 = 144
     expect(tax).toBe(144);
  });

  /**
   * Here's a GOOD test that uses Fluent Builders
   */
  it('should calculate tax and ignore exempt items', () => {

    let calculator = new TaxCalculator();

    let rates = [
      new TaxRateBuilder().withRate(10).build(),
      new TaxRateBuilder().withRate(6).build()
    ];

    let order = new OrderBuilder()
      .addItem().withPrice(400).add()
      .addItem().withPrice(500).withTaxExempt(true).add()
      .build();

    let tax = calculator.calulate(order,rates);

    // (400) * (10 + 6) / 100 = 144
    expect(tax).toBe(64);
  });

  /**
   * Here's a GOOD test that uses Fluent Builders
   */
  it('should calculate tax and account for combinable, tax exempt items', () => {

    let calculator = new TaxCalculator();

    let rates = [
      new TaxRateBuilder().withRate(10).build(),
      new TaxRateBuilder().withRate(6).build()
    ];

    let order = new OrderBuilder()
      .addItem().withPrice(400).add()
      .addItem().withPrice(500).withCombinable(true).withTaxExempt(true).add()
      .addItem().withPrice(500).withCombinable(true).add()
      .build();

    let tax = calculator.calulate(order,rates);

    // (400) * (10 + 6) / 100 = 64
    expect(tax).toBe(64);
  });


  it('just some randome example code', () => {

    let order2 = new OrderBuilder()
      .withOrderId(5332)
      .withOriginationId('trk-503-100-b123')
      .withTrackingId(1000867)
      .build();

    let order3 = new OrderBuilder()
      .addItems({
        itemId: 198219,
        sku: 'BLK-MED-G123-GUC',
        name: 'socks',
        weight: 554,
        price: 999,
        combinable: false,
        taxExempt: false})
        .build();


    let order4 = new OrderBuilder()
      .addItems(
        new ItemBuilder()
        .withPrice(999)
        .build() as Item)
      .build();

    let order = new OrderBuilder()
      .addItem()
        .withPrice(999).add()
      .build();
  });

  /**
   * You might be tempted to write something like this, but in
   * some uses, it creates a Hidden Oracle!
   */
  function getOrder(): Order {
    return {
      orderId: 84242,
      trackingId: 1929781,
      originationId: 'tlq-19973-a76',
      tags: [],
      items: [
        {
          itemId: 198219,
          sku: 'BLK-MED-G123-GUC',
          name: 'socks',
          weight: 554,
          price: 999,
          combinable: false,
          taxExempt: false
        }]
      };
  }

  /**
   * You might be tempted to write something like this, but in
   * some uses, it creates a Hidden Oracle!
   */
  function getRate(): TaxRate {
    return {
      name: "WA State Sales Tax",
      rate: 10.1
    };
  }
});
