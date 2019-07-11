#!/usr/bin/env bash

VERSION=$1
if [[ -z "$VERSION" ]]; then
	echo "Upload expansion to production"
	echo "Usage: command [version]"
	exit
fi

VERSION="${VERSION}-en-phone-hdpi"

if [[ -d "api/public/expansions/${VERSION}" ]]; then
	echo "Missing specified version!"
	exit
fi

ssh root@munhauzen.fingertips.cf "mkdir -p /var/www/munhauzen-web/api/public/expansions/${VERSION}"

scp api/public/expansions/${VERSION}/* \
    root@munhauzen.fingertips.cf:/var/www/munhauzen-web/api/public/expansions/${VERSION}
