
/**
 * A stand-in class for a SUT.  Because I don't want to make anything more complicated.
 */
export class TaxCalculator {

  /**
   * Calcualte a total tax based on an Order aand list of TaxRates
   *
   * Note:  Probaly not the clearest implementation, but that's life!
   * @param order - the Order
   * @param rates - the List of TaxRates
   */
  public calulate(order:Order, rates:TaxRate[]): number {

    // Sum the tax rate
    // Why can't the caller just pass in the total... IDK!
    let taxRateSum = rates.reduce((acc,tax) => {
      return acc + tax.rate;
    },0);

    // Get all the cominable items
    let combinableItems = order.items.filter((item) => {
      return item.combinable;
    });

    // If any of the combinable items are exempt, exempt will equeal true
    let exempt = combinableItems.reduce((acc,item) => {
      return acc || item.taxExempt;
    }, false);

    // If any are exempt, remove ALL combinable from oritinal array
    // Else, keep the original full list of items
    let remainingItems: Item[] = [];
    if(exempt) {
      remainingItems = order.items.filter((item) => {
        return !item.combinable;
      });
    } else {
      remainingItems = order.items;
    }

    // Calculate the total tax from the combined taxRate, and remaining items
    let tax = remainingItems.reduce((acc, item) => {
      return item.taxExempt ? acc : acc + (taxRateSum * item.price);
    },0);

    return Math.round(tax / 100 );

  }
}

/**
 * Simple Order class
 */
export class Order {
  public orderId: number = 0;
  public trackingId: number = 0;
  public originationId: string = '';
  public tags: string[] = [];
  public items: Item[] = [];
}

/**
 * Simple Item class
 */
export class Item {
  public itemId: number = 0;
  public sku: string = "";
  public name: string = "";
  public weight: number = 0;
  public price: number = 0;
  public combinable: boolean = false;
  public taxExempt: boolean = false;
}

/**
 * Simple TaxRate class
 */
export class TaxRate {
  public name: string = "";
  public rate: number = 0.0;
}