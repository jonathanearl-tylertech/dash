#! /bin/bash
cd "$(dirname "$0")"
export SOPS_AGE_KEY_FILE=~/.sops/age-key.txt
sops -d ../deployment/secret.enc.yaml > ../deployment/secret.yaml