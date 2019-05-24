
git config -g user.email gram7gram@gmail.com && git config -g user.name Gram

git checkout -b $1

git pull origin $1

cd www

./npm run build:prod