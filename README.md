# README

## How to build and deploy using docker

Using the ./Dockerfile and the command on in the project's root folder:
`docker build -t template_frontend:1 .`

Run the image

```bash
docker run --rm -d --name template_frontend \
  --network template-network \
  --ip 173.100.1.103 -p 4200:80 \
  template_frontend:1
```

Stop the image only if is running

```bash

docker ps -a --format="table {{.Names}}" | grep template_frontend 1> /dev/null || \
  docker stop template_frontend

```

<!-- 

-

-->

## Cheat sheet commands

```shell
docker run -ti --rm --name test_node_img -w /app -v ./3_front/:/app node:22-alpine3.21 sh
```


