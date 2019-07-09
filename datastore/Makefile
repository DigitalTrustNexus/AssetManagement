.PHONY: all build build-local devmode devmode-local build-shell clean
SHELL=/bin/sh

REPO=blockchainDatastore
TAGS=latest
REG=registry.gear.ge.com

build_image=blockchain-datastore-build
docker_buildargs = --build-arg http_proxy=$(http_proxy) --build-arg https_proxy=$(https_proxy) --build-arg no_proxy=$(no_proxy)
docker_runargs = #-p 8080:8080 -w /www/blockchain-services -v $(shell pwd):/www/blockchain-services
docker = docker run --rm -i ${docker_runargs}

all: build

${build_image}.created:
	docker build ${docker_buildargs} -f docker/Dockerfile.build -t ${build_image} .
	touch ${build_image}.created

build: ${build_image}.created
	@echo "Building code... "
	docker build ${docker_buildargs} -f docker/Dockerfile.build -t ${build_image} .
	@echo "Done building code"

build-local:
	@npm start

devmode: ${build_image}.created
	@docker run                                                                                \
		--rm -it ${docker_runargs}                                                             \
		--network=blockchainAssetControlDemo_net                                               \
		--name blockchain-datastore-build-complete                                             \
		--link blockchain-services-build-complete:blockchain-services-build-complete           \
		-p 5432:5432                                                                           \
		${build_image}                                                                         

clean:
	@if [ $(shell docker ps -a | grep $(build_image) | wc -l) != 0 ]; then \
		docker ps -a | grep $(build_image) | awk '{print $$1 }' | xargs docker rm -f; \
	fi
	@if [ $(shell docker images | grep $(build_image) | wc -l) != 0 ]; then \
		docker images | grep $(build_image) | awk '{print $$3}' | xargs docker rmi -f || true; \
	fi
	@if [ -f ${build_image}.created ]; then \
		rm ${build_image}.created; \
	fi
