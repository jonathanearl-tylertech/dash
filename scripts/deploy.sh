#! /bin/bash
cd "$(dirname "$0")"
export SOPS_AGE_KEY_FILE=~/.sops/age-key.txt
kubectl apply -f ../deployment/dash.yaml
kubectl apply -f ../deployment/config.yaml
./decrypt.sh
kubectl apply -f ../deployment/secret.yaml
rm ../deployment/secret.yaml