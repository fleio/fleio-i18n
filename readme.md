This repository contains translations for Fleio - see http://fleio.com for details.


## How to add a new language to fleio

Fleio backend is created with Django and Fleio fronted is created with Angular.

### Adding a translation for a new language to backend

Before running the commands below enter the utils container by executing:

`fleio bash`

and then activate the virtual environment:

`source /var/webapps/fleio/env/bin/activate`

Run the following command for the language you want to add from Fleio backend installation directory:

`python manage.py makemessages -l <language_code>`

replace `<language_code>` with the code for your new language (e.g. `ro`, `en`, `fr` ...)

After the command runs successfully a new subdirectory for your language should be created in
`/var/webapps/fleio/project/locale` directory.

**Fleio utils container is destroyed after you exit it, so we would advise you to copy the 
.po files to your host, edit them and then add them to the backend, celery and operations container.**

To copy to .po file from the utils container to your host, open a new terminal and connect to your Fleio VM, then run the following command:

`docker cp $(docker ps -a | grep utils | awk '{print $1}'):/var/webapps/fleio/project/locale/<language_code>/LC_MESSAGES/django.po .`

You can use `Poedit` tool to edit the django.po file for your new language.

After you finish editing the `django.po file`, you need to generate the `django.mo file`. Run the following command to 
copy the edited `django.po` file back to your utils container:

`docker cp django.po $(docker ps -a | grep utils | awk '{print $1}'):/var/webapps/fleio/project/locale/<language_code>/LC_MESSAGES/django.po`

Then go back to the previous terminal that still has the connection to the utils container active and run `python manage.py compilemessages`.

Now you should have both `django.po` and `django.mo` with your translations. Copy the new compiled `django.mo` to your host:

`docker cp $(docker ps -a | grep utils | awk '{print $1}'):/var/webapps/fleio/project/locale/<language_code>/LC_MESSAGES/django.mo .`

Now, you need to add them to your backend, celery and operations containers.

Create a new directory in `/home/fleio/compose` called `translations` and copy the edited and compiled `django.po` and 
`django.mo` inside that folder.

Alongside `django.po` the following Dockerfiles inside must be created:

* Dockerfile-backend

```
ARG FLEIO_DOCKER_HUB
ARG FLEIO_RELEASE_SUFFIX

FROM ${FLEIO_DOCKER_HUB}/fleio_backend${FLEIO_RELEASE_SUFFIX}

ENV INSTALL_PATH="/var/webapps/fleio"

COPY --chown=fleio:fleio django.po "$INSTALL_PATH/project/locale/<language_code>/LC_MESSAGES/django.po"
COPY --chown=fleio:fleio django.mo "$INSTALL_PATH/project/locale/<language_code>/LC_MESSAGES/django.mo"
```

* Dockerfile-celery

```
ARG FLEIO_DOCKER_HUB
ARG FLEIO_RELEASE_SUFFIX

FROM ${FLEIO_DOCKER_HUB}/fleio_celery${FLEIO_RELEASE_SUFFIX}

ENV INSTALL_PATH="/var/webapps/fleio"

COPY --chown=fleio:fleio django.po "$INSTALL_PATH/project/locale/<language_code>/LC_MESSAGES/django.po"
COPY --chown=fleio:fleio django.mo "$INSTALL_PATH/project/locale/<language_code>/LC_MESSAGES/django.mo"
```

* Dockerfile-operations

```
ARG FLEIO_DOCKER_HUB
ARG FLEIO_RELEASE_SUFFIX

FROM ${FLEIO_DOCKER_HUB}/fleio_operations${FLEIO_RELEASE_SUFFIX}

ENV INSTALL_PATH="/var/webapps/fleio"

COPY --chown=fleio:fleio django.po "$INSTALL_PATH/project/locale/<language_code>/LC_MESSAGES/django.po"
COPY --chown=fleio:fleio django.mo "$INSTALL_PATH/project/locale/<language_code>/LC_MESSAGES/django.mo"
```

#### Note: Depending on edition, you might need to add _web or _openstack on the 4th line of each Dockerfile e.g. FROM ${FLEIO_DOCKER_HUB}/fleio_backend${FLEIO_RELEASE_SUFFIX} will be FROM ${FLEIO_DOCKER_HUB}/fleio_backend_openstack${FLEIO_RELEASE_SUFFIX} or FROM ${FLEIO_DOCKER_HUB}/fleio_backend_web${FLEIO_RELEASE_SUFFIX}


Add this to your /home/fleio/compose/docker-compose.override.yml file:

```
# Add here your docker-compose customizations
# docker-compose.override.yml is not overwritten by Fleio
# (while docker-compose.yml may be OVERWRITTEN on Fleio upgrades)

version: "3.7"

services:
  backend:
    build:
      context: ./translations/
      dockerfile: Dockerfile-backend
      args:
        - FLEIO_DOCKER_HUB
        - FLEIO_RELEASE_SUFFIX
    image: fleio_backend_custom

  celery:
    build:
      context: ./translations/
      dockerfile: Dockerfile-celery
      args:
        - FLEIO_DOCKER_HUB
        - FLEIO_RELEASE_SUFFIX
    image: fleio_celery_custom
    
  operations:
    build:
      context: ./translations/
      dockerfile: Dockerfile-operations
      args:
        - FLEIO_DOCKER_HUB
        - FLEIO_RELEASE_SUFFIX
    image: fleio_updated_custom

```

Next step would be to build the new images using your custom `django.po` and `django.mo` files:

```
cd /home/fleio/compose
docker-compose build && docker-compose up -d
```

### Adding a translation for a new language to the Angular frontend

From version 2021.04.0 of Fleio you can add translations for the new Angular frontend.

In order to do so get the template.json file from this repo, copy it to a file named `messages.<language_code>.json`, where `language_code` is the language code (e.g. "messages.fr.json"). 
Edit the strings in this file and after that we can publish those on Fleio server for each panel we want to allow translations.

We add our `messages.<language_code>.json` file to the `/home/fleio/compose/translations/` directory as we did for backend translations too (see above)
and in the `/home/fleio/compose/translations/` we're going to create a new `Dockerfile-frontend` file with the following content:

```
# define the build arguments that are used below to reference the base docker frontend image
ARG FLEIO_DOCKER_HUB
ARG FLEIO_RELEASE_SUFFIX

FROM ${FLEIO_DOCKER_HUB}/fleio_frontend${FLEIO_RELEASE_SUFFIX}

# we're defining the Fleio installation path in one place and we're using it below
ENV INSTALL_PATH="/var/webapps/fleio"

COPY messages.<language_code>.json "$INSTALL_PATH/frontend/enduser/assets/locale/messages.<language_code>.json"
```

If you want to add the translations to the Staff and Reseller panels too, you need to copy `template-staff.json` or `template-reseller.json` to
`messages.<language_code>-staff.json` or `messages.<language_code>-reseller.json>` and then edit them. Next, you need to add these lines in the `Dockerfile-frontend` file:

```
COPY messages.<language_code>-staff.json "$INSTALL_PATH/frontend/staff/assets/locale/messages.<language_code>.json"
COPY messages.<language_code>-reseller.json "$INSTALL_PATH/frontend/reseller/assets/locale/messages.<language_code>.json"
```

Add the following code at the end of the `/home/fleio/compose/docker-compose.override.yml` file:

```
  frontend:
    build:
      context: ./translations/
      dockerfile: Dockerfile-frontend
      args:
        - FLEIO_DOCKER_HUB
        - FLEIO_RELEASE_SUFFIX
    image: fleio_frontend_custom
```

Build the new images using your custom `messages.<language_code>.json` file:

```
cd /home/fleio/compose
docker-compose build && docker-compose up -d
```

You can also update the `defaultLanguage` variable and login/signup pages will be changed according to that. 
Keep in mind that when changing default language of a panel, you need to have the related `messages.<language_code>.json` file in the appropriate directory.

### Enabling the new language

In order to enable the new language add the `LANGUAGES` variable to your `settings.py` file. 
Run `fleio edit settings.py` command to edit it and at the end, add the following variable:

```
LANGUAGES = (
    ('en', 'English'),
    ('ro', 'Română'),
    ('<language_code>', 'Language'),
)
```

Replace the `<language_code>` and `Language` accordingly.

'/var/webapps/fleio/project/fleio/base_settings.py'
to `/var/webapps/fleio/project/fleio/settings.py` and add your new language there. You can also remove default language 
options from this variable.

After all changes are done restart fleio by running `fleio restart` command.


## License information

fleio-i18n is licensed under BSD License. See the "LICENSE" file for more information.

## Thanks

* Thanks to [Hopla](https://hopla.cloud) for the French translation
* Thanks to [Binero](https://binero.com) for the Swedish translation

