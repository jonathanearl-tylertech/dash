#! /bin/bash
cd "$(dirname "$0")"
echo $GITHUB_TOKEN | docker login ghcr.io -u jonathanearl-tylertech --password-stdin
cd client
docker build . --tag ghcr.io/jonathanearl-tylertech/dash:0.0.7
docker push ghcr.io/jonathanearl-tylertech/dash:0.0.7