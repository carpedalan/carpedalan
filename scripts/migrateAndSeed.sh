set -e
echo "**************** Beginning DB Migration ****************"
yarn knex migrate:latest --knexfile db/setup.js
# yarn knex migrate:latest --knexfile db/knexfile.js
# yarn knex seed:run --knexfile db/knexfile.js
sh -ac 'source .env && \
echo $PG_URI && \
cat ./dev-dump.sql | psql $PG_URI'

echo "**************** Finished DB Migration ****************"