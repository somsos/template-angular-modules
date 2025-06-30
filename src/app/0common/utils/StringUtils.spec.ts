import { StringUtils } from './StringUtils';

const tests = [
  { ru: 'api/v1/products/${id}', req: 'api/v1/products/901', expected: true },
  {
    ru: 'api/v1/products/${id}/images/${imageId}',
    req: 'api/v1/products/1/images/2',
    expected: true,
  },
  {
    ru: 'api/v1/products/${id}/images/${imageId}',
    req: 'api/v1/products/20/images/200?foo=1&bar=2',
    expected: true,
  },
  { ru: 'users/${id}', req: 'users/22', expected: true },
  { ru: 'users/${id}', req: 'users/10000?s=1', expected: true },
  {
    ru: 'table/${tableIndex}/chair/${chairIndex}/plate/${plateIndex}',
    req: 'table/10/chair/22/plate/303',
    expected: true,
  },
  { ru: 'api/v1/products/${id}', req: 'api/v1/products', expected: false },
  {
    ru: 'api/v1/products/${id}/images/${imageId}',
    req: 'api/v1/products/images/2',
    expected: false,
  },
  {
    ru: 'api/v1/products/${id}/images/${imageId}',
    req: 'api/v1/products/20/images',
    expected: false,
  },
  { ru: 'users/${id}/role/1', req: 'users/22', expected: false },
  { ru: 'users/${id}', req: 'usersx/10000?s=1', expected: false },
  {
    ru: 'table/${tableIndex}/chair/${chairIndex}/plate/${plateIndex}',
    req: 'chair/22/plate/303',
    expected: false,
  },
];

describe('StringUtils', () => {
  it('compareUrls', () => {
    tests.forEach((t) => {
      const got = StringUtils.compareUrls(t.ru, t.req);
      expect(got).toBe(t.expected);
    });
  });
});
