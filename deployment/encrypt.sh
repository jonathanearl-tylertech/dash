#! /bin/bash
cd "$(dirname "$0")"
export SOPS_AGE_RECIPIENTS=$(<public-age-keys.txt)
sops --encrypt --age ${SOPS_AGE_RECIPIENTS}  secret.yaml > secret.enc.yaml