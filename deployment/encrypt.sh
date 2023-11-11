#! /bin/bash
set -e
cd "$(dirname "$0")"
export SOPS_AGE_RECIPIENTS=$(<public-age-keys.txt)
sops --encrypt --age ${SOPS_AGE_RECIPIENTS}  config.yaml > config.enc.yaml
