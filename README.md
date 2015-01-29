#consul-dash


## Run instructions
`docker run -e "CONSUL_LOCATION=docker02.bva.nu:8500" -d bvaauctions/consul-dash`
Then, visit [the site](http://boot2docker:80/).


## Dev instructions
`docker run -e "CONSUL_LOCATION=docker02.bva.nu:8500" --volume $(pwd)/app:/usr/share/nginx/html $@ --name consul-dash consul-dash`


## Build instructions
`docker build -t bvaauctions/consul-dash:latest . && docker push bvaauctions/consul-dash:latest`
