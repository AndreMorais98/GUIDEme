#!/bin/sh

cd /guideme/guideme

python manage.py migrate --no-input

python manage.py runserver_plus 0.0.0.0:8000 --nopin
