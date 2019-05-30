DATABASE_NAME=munhauzen

CURRENT_DATE=$(date +%Y_%m_%d_%H_%M)

echo "[+] Creating backup $CURRENT_DATE"

if [ ! -d ./backups ]; then mkdir ./backups; fi

ID=$(/usr/local/bin/docker-compose ps -q db)

/usr/bin/docker exec $ID sh -c "exec mongodump -d $DATABASE_NAME --archive" > ./backups/"$DATABASE_NAME"_"$CURRENT_DATE".dump