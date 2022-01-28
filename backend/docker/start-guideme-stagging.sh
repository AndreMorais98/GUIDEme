#!/bin/sh

cd /guideme/src

python manage.py collectstatic --noinput
python manage.py migrate --no-input

gunicorn guideme.wsgi:application --bind 0.0.0.0:$PORT
