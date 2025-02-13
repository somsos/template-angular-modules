import {
  HttpRequest,
  HttpResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { AppError } from '../../../0common';
import { ProductDao } from '../ProductDao';
import { ProductDto } from '../../commons/ProductDto';
import { StringUtils } from '../../../0common';

// array in local storage for registered users
const productsKeyStore = 'productsKeyStore';
let allProducts: ProductDto[] =
  JSON.parse(localStorage.getItem(productsKeyStore)!) || [];

export function productsMockBackend(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const { url, method, headers, body } = req;

  createProductsStoreIfNotExists();

  return handleRoute();

  function handleRoute() {
    switch (true) {
      case url.endsWith(ProductDao.pathRoot) && method === 'GET':
        return getAll();

      case url.endsWith(ProductDao.pathRoot) && method === 'POST':
        return save();

      case StringUtils.compareUrls(ProductDao.pathId, url) && method === 'GET':
        return getById();

      case StringUtils.compareUrls(ProductDao.pathId, url) &&
        method === 'DELETE':
        return deleteById();

      case StringUtils.compareUrls(ProductDao.pathId, url) && method === 'PUT':
        return update();

      default:
        // pass through any requests not handled above
        return next(req);
    }
  }

  // route functions

  function getAll(): Observable<HttpResponse<ProductDto>> {
    //const { username, password } = body;
    if (!allProducts || allProducts.length == 0) {
      return ok([]);
    }
    return ok(allProducts);
  }

  function save(): Observable<HttpResponse<ProductDto>> {
    const jwt = headers.get("Authorization");
    if(!jwt) {
      return unauthorized();
    }
    body.id = getBiggestId() + 1;
    allProducts.unshift(body);
    const newStore = JSON.stringify(allProducts);
    localStorage.setItem(productsKeyStore, newStore);
    return ok(body);
  }

  function getById(): Observable<HttpResponse<ProductDto>> {
    const id = getPathId();
    const found = allProducts.find((p) => p.id === id);
    if (!found) {
      return error('producto no encontrado');
    }
    return ok(found);
  }

  function deleteById(): Observable<HttpResponse<ProductDto>> {
    const id = getPathId();
    const found = allProducts.find((p) => p.id === id);
    if (!found) {
      return error('producto no encontrado');
    }
    allProducts = allProducts.filter((p) => p.id !== found.id);
    localStorage.setItem(productsKeyStore, JSON.stringify(allProducts));
    return ok(found);
  }

  function update(): Observable<HttpResponse<ProductDto>> {
    const id = getPathId();
    const i = allProducts.findIndex((p) => p.id === id);
    if (i === -1) {
      return error('producto no encontrado');
    }
    allProducts[i] = body;
    localStorage.setItem(productsKeyStore, JSON.stringify(allProducts));
    return ok(body);
  }

  // helper functions

  function getPathId(): number {
    const pathId = url.substring(url.lastIndexOf('/') + 1, url.length);
    const id = StringUtils.toNumber(pathId);
    return id;
  }

  function getBiggestId(): number {
    const ids = allProducts.map((p) => p.id);
    const higherId = Math.max.apply(Math, ids);
    return higherId;
  }

  function createProductsStoreIfNotExists() {
    const store = localStorage.getItem(productsKeyStore);
    if (!store) {
      localStorage.setItem(
        productsKeyStore,
        '[{"id": 1,"name": "Wireless Headphones","price": 99.99,"description": "Over-ear wireless headphones with noise-canceling technology."  },  {"id": 2,"name": "Smartphone","price": 799.99,"description": "Latest smartphone with a high-resolution camera and large display."  },  {"id": 3,"name": "Gaming Laptop","price": 1499.99,"description": "High-performance laptop designed for gaming and heavy tasks."  },  {"id": 4,"name": "Bluetooth Speaker","price": 49.99,"description": "Portable Bluetooth speaker with 10 hours of battery life."  },  {"id": 5,"name": "Smartwatch","price": 199.99,"description": "Water-resistant smartwatch with fitness tracking and heart rate monitor."  },  {"id": 6,"name": "4K LED TV","price": 599.99,"description": "60-inch 4K UHD LED TV with built-in smart features and streaming apps."  },  {"id": 7,"name": "Laptop Backpack","price": 39.99,"description": "Stylish and durable backpack designed for laptops and daily use."  },  {"id": 8,"name": "Electric Toothbrush","price": 59.99,"description": "Rechargeable electric toothbrush with multiple brushing modes."  },  {"id": 9,"name": "Portable Power Bank","price": 29.99,"description": "Compact power bank for charging devices on the go."  },  {"id": 10,"name": "Smart Thermostat","price": 129.99,"description": "Wi-Fi enabled smart thermostat for controlling home temperature remotely."}]'
      );
    }
  }

  function ok(body?: any): Observable<HttpResponse<any>> {
    const resp = of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
    return resp;
  }

  function error(message: string): Observable<never> {
    const error = new AppError(message, HttpStatusCode.Forbidden);
    const errorResponse = throwError(() => error).pipe(
      materialize(),
      delay(1000),
      dematerialize()
    ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    return errorResponse;
  }

  function unauthorized(): Observable<never> {
    const error = new AppError('Unauthorized', HttpStatusCode.Forbidden);
    return throwError(() => error).pipe(
      materialize(),
      delay(1000),
      dematerialize()
    );
  }
}

/*




[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "price": 99.99,
    "description": "Over-ear wireless headphones with noise-canceling technology."
  },
  {
    "id": 2,
    "name": "Smartphone",
    "price": 799.99,
    "description": "Latest smartphone with a high-resolution camera and large display."
  },
  {
    "id": 3,
    "name": "Gaming Laptop",
    "price": 1499.99,
    "description": "High-performance laptop designed for gaming and heavy tasks."
  },
  {
    "id": 4,
    "name": "Bluetooth Speaker",
    "price": 49.99,
    "description": "Portable Bluetooth speaker with 10 hours of battery life."
  },
  {
    "id": 5,
    "name": "Smartwatch",
    "price": 199.99,
    "description": "Water-resistant smartwatch with fitness tracking and heart rate monitor."
  },
  {
    "id": 6,
    "name": "4K LED TV",
    "price": 599.99,
    "description": "60-inch 4K UHD LED TV with built-in smart features and streaming apps."
  },
  {
    "id": 7,
    "name": "Laptop Backpack",
    "price": 39.99,
    "description": "Stylish and durable backpack designed for laptops and daily use."
  },
  {
    "id": 8,
    "name": "Electric Toothbrush",
    "price": 59.99,
    "description": "Rechargeable electric toothbrush with multiple brushing modes."
  },
  {
    "id": 9,
    "name": "Portable Power Bank",
    "price": 29.99,
    "description": "Compact power bank for charging devices on the go."
  },
  {
    "id": 10,
    "name": "Smart Thermostat",
    "price": 129.99,
    "description": "Wi-Fi enabled smart thermostat for controlling home temperature remotely."
  }
]

*/
