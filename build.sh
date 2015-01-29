#! /usr/bin/env sh

IMAGE=bvaauctions/consul-dash

TAG=$(git rev-parse --short HEAD)

docker $DOCKER_OPTS build -t $IMAGE:$TAG .
docker $DOCKER_OPTS push $IMAGE:$TAG
