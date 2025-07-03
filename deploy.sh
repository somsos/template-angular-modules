#!/bin/bash
set -e

docker ps -a --format="table {{.Names}}" | grep template_frontend 1> /dev/null && \
  echo "Stopping template_frontend" && \
  docker stop template_frontend &> /dev/null || true;

sleep 3

docker run --rm -d --name template_frontend \
  --network template-network \
  --ip 173.100.1.103 -p 80:80 \
  template_frontend:1;

