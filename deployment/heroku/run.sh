#!/usr/bin/bash
cd /app/api
if [ ! -f "database.sqlite" ]; then
  python3 create_db.py # Fill with test data
fi
env

if [ -z "$PORT" ]; then
  export PORT=80
fi

# Make sure that nginx does not have any additional files
rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-available/default
sed -i "s/PORT/$PORT/g" /app/nginx.conf

gunicorn --bind=unix:/tmp/gunicorn.sock --workers=4 app:app &
nginx -g "daemon off;"
