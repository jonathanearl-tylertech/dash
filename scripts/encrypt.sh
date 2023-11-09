#! /bin/bash
cd "$(dirname "$0")"
export SOPS_AGE_RECIPIENTS=$(<../deployment/public-age-keys.txt)
sops --encrypt --age ${SOPS_AGE_RECIPIENTS} ../deployment/secret.yaml > ../deployment/secret.enc.yaml