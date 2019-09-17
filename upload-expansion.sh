#!/usr/bin/env bash

VERSION=$1
if [[ -z "$VERSION" ]]; then
	echo "Upload expansion to production"
	echo "Usage: command [version]"
	exit
fi

VERSION="${VERSION}-en-phone-hdpi"

ssh root@munchausen.fingertips.cf "mkdir -p /var/www/munhauzen-web/api/public/expansions/${VERSION}"

scp api/public/expansions/${VERSION}/* \
    root@munchausen.fingertips.cf:/var/www/munhauzen-web/api/public/expansions/${VERSION}
