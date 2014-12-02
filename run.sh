#! /usr/bin/env sh

docker build -t consul-dash .
docker run -e "CONSUL_LOCATION=docker02.bva.nu:8500" -d --publish 8001:80 --volume $(pwd)/app:/usr/share/nginx/html $@ consul-dash
