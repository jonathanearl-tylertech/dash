#! /bin/bash
cd ../"$(dirname "$0")"
echo $GITHUB_TOKEN | docker login ghcr.io -u jonathanearl-tylertech --password-stdin
docker build ./client --tag ghcr.io/jonathanearl-tylertech/dash:0.0.9
docker push ghcr.io/jonathanearl-tylertech/dash:0.0.9
export SOPS_AGE_KEY_FILE=~/.sops/age-key.txt
kubectl delete -f ./deployment/dash.yaml
kubectl apply -f ./deployment/dash.yaml
kubectl apply -f ./deployment/config.yaml
./scripts/decrypt.sh
kubectl apply -f ./deployment/secret.yaml
rm ./deployment/secret.yaml