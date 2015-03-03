#! /usr/bin/env sh

if [ ! ${CONSUL_LOCATION} ]; then
  echo "Please set CONSUL_LOCATION"
  exit 1
fi

sed -i"" "s/%%CONSUL_LOCATION%%/${CONSUL_LOCATION}/g" /usr/share/nginx/html/assets/app-*.js

nginx -g "daemon off;"
