#! /bin/bash
echo $GITHUB_TOKEN | docker login ghcr.io -u whattheearl --password-stdin
docker build . --tag ghcr.io/whattheearl/dash:latest
docker push ghcr.io/whattheearl/dash:latest