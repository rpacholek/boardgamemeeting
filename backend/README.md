### Prerequisites for development

* Python 3.9.4
* Pipenv
* PostgreSQL (configured according to `settings.local`)

### Getting started

1. `pipenv shell`
1. `pipenv install`

### Useful commands

Migrate the existing database (first migration will create django roles and tables)

```shell
python manage.py migrate --settings=boardgamemeeting.settings.local
```

Start server for local development

```shell
python manage.py runserver --settings=boardgamemeeting.settings.local
```

Create admin user for Django Admin

```shell
python manage.py createsuperuser --settings=boardgamemeeting.settings.local
```