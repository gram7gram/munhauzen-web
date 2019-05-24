#!/bin/bash

# Create containers
docker-compose build

# Boot containers
docker-compose up -d

# Install dependencies
cd /var/www/munhauzen-web/www && ./npm i --quite

cd /var/www/munhauzen-web/api && ./npm i --quite
