FROM node:22-alpine3.21 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build -c production



# RUN



FROM nginx:stable-alpine3.21

COPY --from=build app/dist/mod51io/browser /usr/share/nginx/html

COPY Dockerfile-nginx.config /etc/nginx/nginx.conf

EXPOSE 80
