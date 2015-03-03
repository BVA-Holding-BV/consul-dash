#! /usr/bin/env sh

docker build -t web .
docker run -e "CONSUL_LOCATION=consul03.bva.nu:8500" --rm --publish 8001:80 --volume $(pwd)/app:/usr/share/nginx/html $@ web
