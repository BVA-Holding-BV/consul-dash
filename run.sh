#! /usr/bin/env sh

docker build -t web .
docker run --rm --publish 80:80 --volume $(pwd)/app:/usr/share/nginx/html $@ web
