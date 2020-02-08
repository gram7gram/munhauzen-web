certbot renew \
	--cert-name thebaronmunchausen.com \
	--webroot-path /var/www/munhauzen-web/www/public

certbot renew \
	--cert-name api.thebaronmunchausen.com \
	--webroot-path /var/www/munhauzen-web/api/public

certbot renew \
	--cert-name admin.thebaronmunchausen.com \
	--webroot-path /var/www/munhauzen-web/admin/build