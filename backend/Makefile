.PHONY=help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

makemigrations:  ## Generate new migration version
	python manage.py migrate

migrate:  ## Apply new migration
	python manage.py update
