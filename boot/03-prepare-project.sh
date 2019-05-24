#!/bin/bash

# Create containers
docker-compose build

# Boot containers
docker-compose up -d

# Install dependencies
cd /var/www/munhauzen-web/www && ./npm i --silent

cd /var/www/munhauzen-web/api && ./npm i --silent

# Prepare production app
cd /var/www/munhauzen-web/www && ./npm run build:prod
