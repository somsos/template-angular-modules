export const environment = {
  production: false,
  img404: "/img/404.png",
  backend: {
    // mock and path must be the same boolean value
    mock: true,
    path: (true) ? '' : 'http://localhost:8080',
  }
};
