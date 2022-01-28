FROM python:3.9

ENV PYTHONPATH $PYTHONPATH:/guideme/guideme
ENV DJANGO_SETTINGS_MODULE guideme.settings

WORKDIR /guideme

COPY requirements /guideme/requirements

RUN pip install -U -r /guideme/requirements/local.txt
