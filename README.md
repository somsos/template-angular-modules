# README

## How to build and deploy using docker

Using the ./Dockerfile and the command on in the project's root folder:
`docker build -t template_front:1 .`

Run the image

```bash
docker run --rm -d --name template_front \
  --network template-network \
  --ip 173.100.1.103 -p 4200:80 \
  template_front:1
```

<!-- 

-

-->

## Cheat sheet commands

```shell
docker run -ti --rm --name test_node_img -w /app -v ./3_front/:/app node:22-alpine3.21 sh
```


