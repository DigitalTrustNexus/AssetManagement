# Build tools
#
# Targets (see each target for more information):
#   build:        assembles the dist folder (builds the site content)
#   devmode:      host the site content in build container in live update
#   build-shell:  terminal access to build container for debugging access
#   image:        builds the docker image
#   clean:        removes build artifacts and image
#

###
### Customize  these variables
###

# The binary to build (just the basename).
NAME := blockchain-services-build

# This version-strategy uses git tags to set the version string
#VERSION := $(shell git describe --tags --always --dirty)
VERSION := 0.1

###
### These variables should not need tweaking.
###

# Platform specific USER  and proxy crud:
# On linux, run the container with the current uid, so files produced from
# within the container are owned by the current user, rather than root.
#
# On OSX, don't do anything with the container user, and let boot2docker manage
# permissions on the /Users mount that it sets up
DOCKER_USER := $(shell if [[ "$$OSTYPE" != "darwin"* ]]; then USER_ARG="--user=`id -u`"; fi; echo "$$USER_ARG")
PROXY_ARGS := -e http_proxy=$(http_proxy) -e https_proxy=$(https_proxy) -e no_proxy=$(no_proxy)



# Default target
all: serve

${NAME}-builder.created:
	@echo "From make process: creating builder image ... "
	@docker build                                                          \
		-t $(NAME):builder                                                 \
		-f docker/Dockerfile.build                                         \
		$$(echo $(PROXY_ARGS) | sed s/-e/--build-arg/g)                    \
		.
	touch ${NAME}-builder.created

serve: ${NAME}-builder.created
	@echo "From make process: launching server container ... "
	@echo $(DOCKER_USER)
	@docker run                                                           \
		--rm                                                              \
		-t                                                                \
		$(DOCKER_USER)                                                    \
		$(PROXY_ARGS)                                                     \
		-v $$(pwd):/www/$(NAME)                                           \
		-w /www/$(NAME)                                                   \
		--network=blockchainAssetControlDemo_net                          \
		-p 8080:8080                                                      \
		-e http_proxy=                                                    \
		-e https_proxy=                                                   \
		-e userIP=$(userIP)                                               \
		-e asset1=$(asset1)                                               \
		-e asset2=$(asset2)                                               \
		-e magento=$(magento)                                             \
		--name blockchain-services-build-complete                         \
		--link blockchain-datastore-build-complete:blockchain-datastore-build-complete \
		--link blockchain-reverse-proxy-build-complete:blockchain-reverse-proxy-build-complete \
		--link peer0:peer0                                                \
		--link peer1:peer1                                                \
		--link peer2:peer2                                                \
		--link ca:ca                                                      \
		--link orderer:orderer                                            \
		--link cli:cli                                                    \
		$(NAME):builder                                                   \
		/bin/sh -c "                                                      \
			VERSION=$(VERSION)                                            \
			./serve.sh                                                    \
		"

build-shell: ${NAME}-builder.created
	@echo "From make process: entering build shell ... "
	@echo $(DOCKER_USER)
	@docker run                                                           \
		--rm                                                              \
		-it                                                               \
		$(DOCKER_USER)                                                    \
		$(PROXY_ARGS)                                                     \
		-v $$(pwd):/www/$(NAME)                                           \
		-w /www/$(NAME)                                                   \
		--network=blockchainAssetControlDemo_net                          \
		-p 8080:8080                                                      \
		-e http_proxy=                                                    \
		-e https_proxy=                                                   \
		-e userIP=$(userIP)                                               \
		-e asset1=$(asset1)                                               \
		-e asset2=$(asset2)                                               \
		-e magento=$(magento)                                             \
		--name blockchain-services-build-complete                         \
		--link blockchain-datastore-build-complete:blockchain-datastore-build-complete \
		--link blockchain-reverse-proxy-build-complete:blockchain-reverse-proxy-build-complete \
		--link peer0:peer0                                                \
		--link peer1:peer1                                                \
		--link peer2:peer2                                                \
		--link ca:ca                                                      \
		--link orderer:orderer                                            \
		--link cli:cli                                                    \
		$(NAME):builder                                                   \
		/bin/bash

image:
	@echo "From make process: packaging runtime image ... "
	@docker build                                                         \
		-t $(NAME):$(VERSION)                                             \
		-f docker/Dockerfile.pkg                                          \
		$$(echo $(PROXY_ARGS) | sed s/-e/--build-arg/g)                   \
		.

clean:
	@echo "From make process: Clean docker process and images."
	@if [ $(shell docker ps -a | grep $(NAME) | wc -l) != 0 ]; then \
		docker ps -a | grep $(NAME) | awk '{print $$1 }' | xargs docker rm -f; \
	fi
	@if [ $(shell docker images | grep $(NAME) | wc -l) != 0 ]; then \
		docker images | grep $(NAME) | awk '{print $$3}' | xargs docker rmi -f || true; \
	fi
	@if [ -f ${NAME}-builder.created ]; then \
		rm ${NAME}-builder.created; \
	fi
