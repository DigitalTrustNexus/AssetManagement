psql -U postgres --command "CREATE USER blockchain WITH SUPERUSER PASSWORD 'blockchain';"
createdb -U postgres -O blockchain blockchain
psql -U postgres -w -d blockchain < schema.psql