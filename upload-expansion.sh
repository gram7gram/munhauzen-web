VERSION=$1
if [ -z "$VERSION" ]; then
	echo "Upload expansion to production"
	echo "Usage: command [version]"
	exit
fi

scp api/public/expansions/$VERSION-expansion.obb root@185.227.111.144:/var/www/munhauzen-web/api/public/expansions/$VERSION-expansion.obb
