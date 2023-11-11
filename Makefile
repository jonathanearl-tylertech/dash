export VERSION=latest
export SOPS_AGE_KEY_FILE=~/.sops/age-key.txt


all: build publish version deploy

build:
	docker build --tag ghcr.io/jonathanearl-tylertech/dash:$(VERSION) client

publish:
	docker push ghcr.io/jonathanearl-tylertech/dash:$(VERSION)

decrypt:
	deployment/decrypt.sh

encrypt:
	deployment/encrypt.sh

version:
	source .env
	npm run semantic-release --prefix client

deploy:
	deployment/decrypt.sh
	kubectl rollout restart deploy dash-deployment