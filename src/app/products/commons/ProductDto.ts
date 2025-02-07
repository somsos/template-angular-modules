export class ProductDto {
  public readonly id?: number;

  public readonly name?: string;

  public readonly price?: number;

  public readonly description?: string;

  public static toAdd(
    nameArg: string,
    priceArg: number,
    descriptionArg: string
  ) {
    const newP: ProductDto = {
      id: undefined,
      name: nameArg,
      price: priceArg,
      description: descriptionArg,
    };
    return newP;
  }
}
