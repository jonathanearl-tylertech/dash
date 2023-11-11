#! /bin/bash
cd "$(dirname "$0")"
export SOPS_AGE_KEY_FILE=~/.sops/age-key.txt
export EDITOR=/usr/bin/nano
sops -d config.enc.yaml > config.yaml