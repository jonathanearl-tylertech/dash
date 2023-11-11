#! /bin/bash
set -e
cd "$(dirname "$0")"

export SOPS_AGE_KEY_FILE=~/.sops/age-key.txt
sops -d config.enc.yaml > config.yaml