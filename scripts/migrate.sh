set -e
echo 'PG_HOSTz'
echo $PG_HOST
echo "**************** Beginning DB Migration ****************"
yarn knex migrate:latest --knexfile db/setup.js
yarn knex migrate:latest --knexfile db/knexfile.js
echo "**************** Finished DB Migration ****************"