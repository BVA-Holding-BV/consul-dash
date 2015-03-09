#! /usr/bin/env sh

docker build -t web .
docker run -e "CONSUL_LOCATION=docker02.bva.nu:8500" --rm --publish 80:80 --volume $(pwd)/app:/usr/share/nginx/html $@ web

