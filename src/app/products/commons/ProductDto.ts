import { StringUtils } from '../../0common/utils/StringUtils';

export class ProductDto {
  public id: number = 0;

  public name: string = '';

  public price?: number = 0;

  public description?: string;

  public static toAdd(
    nameArg: string,
    priceArg: number,
    descriptionArg: string
  ) {
    const newP: ProductDto = {
      id: 0,
      name: nameArg,
      price: priceArg,
      description: descriptionArg,
    };
    return newP;
  }

  public static toShow(
    idArg: number,
    nameArg: string,
    priceArg: number,
    descriptionArg: string
  ) {
    const newP: ProductDto = {
      id: idArg,
      name: nameArg,
      price: priceArg,
      description: descriptionArg,
    };
    return newP;
  }

  static createRandomProductToSave(): ProductDto {
    const randomName = StringUtils.randomStringRange(5, 25);
    const randomPrice = Math.floor(Math.random() * 10000 + 50) / 10;
    const randomDesc = StringUtils.randomStringRange(15, 60);
    const productForm = ProductDto.toAdd(randomName, randomPrice, randomDesc);
    return productForm;
  }

  static createRandomProductToShow(): ProductDto {
    const rId = Math.floor(Math.random() * 1000 + 1);
    const rName = StringUtils.randomStringRange(5, 25);
    const rPrice = Math.floor(Math.random() * 10000 + 50) / 10;
    const rDesc = StringUtils.randomStringRange(15, 60);
    const rProduct = ProductDto.toShow(rId, rName, rPrice, rDesc);
    return rProduct;
  }
}
