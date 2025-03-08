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
import { MockUsersBackendUtils } from '../../../0common/utils/MockBackendUtils';

// array in local storage for registered users
const keyStoreP = 'keyStoreP';
let allProducts: ProductDto[] =
  JSON.parse(localStorage.getItem(keyStoreP)!) || [];

export function productsMockBackend(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const { url, method, headers, body } = req;

  if(url.includes("/users")) {
    return next(req);
  }

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
      return MockUsersBackendUtils.ok([]);
    }
    return MockUsersBackendUtils.ok(allProducts);
  }

  function save(): Observable<HttpResponse<ProductDto>> {
    MockUsersBackendUtils.mustBeAuthenticatedOrThrow(headers);
    MockUsersBackendUtils.addEntity(keyStoreP, body, allProducts);
    return MockUsersBackendUtils.ok(body);
  }

  function getById(): Observable<HttpResponse<ProductDto>> {
    const id = MockUsersBackendUtils.getPathId(url);
    const found = allProducts.find((p) => p.id === id);
    if (!found) {
      return MockUsersBackendUtils.error('producto no encontrado');
    }
    return MockUsersBackendUtils.ok(found);
  }

  function deleteById(): Observable<HttpResponse<ProductDto>> {
    const id = MockUsersBackendUtils.getPathId(url);
    const found = allProducts.find((p) => p.id === id);
    if (!found) {
      return MockUsersBackendUtils.error('producto no encontrado');
    }
    allProducts = allProducts.filter((p) => p.id !== found.id);
    localStorage.setItem(keyStoreP, JSON.stringify(allProducts));
    return MockUsersBackendUtils.ok(found);
  }

  function update(): Observable<HttpResponse<ProductDto>> {
    const id = MockUsersBackendUtils.getPathId(url);
    const i = allProducts.findIndex((p) => p.id === id);
    if (i === -1) {
      return MockUsersBackendUtils.error('producto no encontrado');
    }
    allProducts[i] = body;
    localStorage.setItem(keyStoreP, JSON.stringify(allProducts));
    return MockUsersBackendUtils.ok(body);
  }

  // helper functions

  function createProductsStoreIfNotExists() {
    const store = localStorage.getItem(keyStoreP);
    if (!store) {
      localStorage.setItem(
        keyStoreP,
        '[{"id": 1,"name": "Wireless Headphones","price": 99.99,"description": "Over-ear wireless headphones with noise-canceling technology."  },  {"id": 2,"name": "Smartphone","price": 799.99,"description": "Latest smartphone with a high-resolution camera and large display."  },  {"id": 3,"name": "Gaming Laptop","price": 1499.99,"description": "High-performance laptop designed for gaming and heavy tasks."  },  {"id": 4,"name": "Bluetooth Speaker","price": 49.99,"description": "Portable Bluetooth speaker with 10 hours of battery life."  },  {"id": 5,"name": "Smartwatch","price": 199.99,"description": "Water-resistant smartwatch with fitness tracking and heart rate monitor."  },  {"id": 6,"name": "4K LED TV","price": 599.99,"description": "60-inch 4K UHD LED TV with built-in smart features and streaming apps."  },  {"id": 7,"name": "Laptop Backpack","price": 39.99,"description": "Stylish and durable backpack designed for laptops and daily use."  },  {"id": 8,"name": "Electric Toothbrush","price": 59.99,"description": "Rechargeable electric toothbrush with multiple brushing modes."  },  {"id": 9,"name": "Portable Power Bank","price": 29.99,"description": "Compact power bank for charging devices on the go."  },  {"id": 10,"name": "Smart Thermostat","price": 129.99,"description": "Wi-Fi enabled smart thermostat for controlling home temperature remotely."}]'
      );
    }
  }
}
