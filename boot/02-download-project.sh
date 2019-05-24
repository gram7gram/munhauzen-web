#!/bin/bash

cd /var/www

git clone https://github.com/gram7gram/munhauzen-web --depth=1 --branch=master

cd /var/www/munhauzen-web

cp docker-compose.yml.dist docker-compose.yml

cp api/.env.dist api/.env
cp api/env/Dockerfile.dist api/env/Dockerfile

cp www/src/parameters.js.dist www/src/parameters.js
cp www/env/Dockerfile.dist www/env/Dockerfile