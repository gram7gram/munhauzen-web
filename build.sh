#!/usr/bin/env bash

cd admin && ./npm run build:prod

git add admin/build

git commit -m '#master build'