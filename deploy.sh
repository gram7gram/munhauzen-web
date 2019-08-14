#!/usr/bin/env bash

SERVER=185.227.111.144

ssh root@${SERVER} "cd /var/www/munhauzen-web && bash update.sh master"
