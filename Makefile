#! /usr/bin/make
VERSION=latest

all: build publish deploy

build:
	docker build --tag ghcr.io/jonathanearl-tylertech/dash:$(VERSION) client

publish:
	docker push ghcr.io/jonathanearl-tylertech/dash:$(VERSION)

decrypt:
	sops -d deployment/config.enc.yaml > deployment/config.yaml

encrypt:
	sops --encrypt --age ${SOPS_AGE_RECIPIENTS}  deployment/config.yaml > deployment/config.enc.yaml

version:
	npm run semantic-release --prefix client

deploy:
	kubectl rollout restart deploy dash-deployment