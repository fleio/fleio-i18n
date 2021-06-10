This repository contains translations for Fleio - see http://fleio.com for details.


## How to add a new language to fleio

Fleio backend is created with Django and Fleio fronted is created with AngularJS.

### Adding a translation for a new language to backend

Before running the commands below activate fleio virtual environment by executing:

`source /opt/rh/rh-python35/enable` - this command is needed only on centos

`source /var/webapps/fleio/env/bin/activate`

and then change directory to:

`/var/webapps/fleio/project`

Run the following command for the language you want to add from Fleio backend installation directory:

`python manage.py makemessages -l <language_code>`

replace `<language_code>` with the code for your new language (e.g. `ro`, `en`, `fr` ...)

After the command runs successfully a new subdirectory for your language should be created in
locale directory - you can use `Poedit` tool to edit the django.po file for your new language.

Once you are done editing the `django.po` file run the following command: 

`python manage.py compilemessages`

to generate the `django.mo` file.


### Adding a translation for a new language to frontend

`gulp` is needed to add a new language to fronted.
The `template.pot` file needed is supplied in this repository 
in `translations/frontend/po directory`.

Prepare a directory where you will work on frontend translations - this directory should have the same structure and 
contents as `https://github.com/fleio/fleio-i18n/tree/master/translations/frontend` directory. The "gulpfile.js" 
file found in this directory contains the task definition that will generate the "language.js" file. You will need to 
run the "gulp translations" command from here when ready.

Change into this directory and install `gulp` and `gulp-angular-gettext` npm packages using the following commands:

`npm install gulp`

`npm install gulp-angular-gettext`

If `npm` is not present on your system you should install it using yum or apt, depending on your distro.

Open the latest version of `Poedit` and click on `File -> New from POT/PO File...`, selecting the `template.pot` 
file found in this repository. Choose the language of translation (e.g.: 'en', 'ru', 'fa', ...) and you will be 
able to start translating strings. Make sure you save your `.po` translation file.

After you edit the translation file with `Poedit` use `gulp translations` to generate `.js` files from `.po` files.

Note: if you encounter any problems with the above command, make sure you have latest npm version or specify the 
gulp.js file manually like this: `node ./node_modules/gulp/bin/gulp.js translations`.

The new language file should be placed in the `fleio_frontend_1` container, in `/var/webapps/fleio/frontend/site/translations`.
Additionally, you need to add the following code it to your index.html file. 

`<script src="translations/ro.js"></script>`

We have an example on how to add custom files to the fleio_frontend_1 container and how to add custom 
code in the index.html file here: https://fleio.com/docs/developer/add-change-docker-files.html#example-change-favicon-add-custom-css-and-google-analytics

If we follow that example, we see that we need to add the following lines to our Dockerfile:

```
COPY ro.js /var/webapps/fleio/frontend/site/translations/ro.js
RUN sed -i \
's^<!-- end of body -->^<script src="translations/ro.js"></script><!-- end of body -->^' \
/var/webapps/fleio/frontend/site/index.html
RUN sed -i \
's^<!-- end of body -->^<script src="translations/ro.js"></script><!-- end of body -->^' \
/var/webapps/fleio/frontend/site/staff/index.html
```

### Adding a translation for a new language to the new Angular frontend

From version 2021.04.0 of Fleio you can add translations for the new Angular frontend.

In order to do so get the template.json file from this repo, copy it to a file named "messages.{lang}.json", where "lang" is the language code (e.g. "messages.fr.json"). Edit the strings in this file and after that we can publish those on Fleio server for each panel we want to allow translations.

On deb/rpm installations of Fleio, copy the json file containing translations to `/var/webapps/fleio/frontend/enduser/assets/locale`. Do so for other panels if you want translations on each of them.

If you have Fleio installed using Docker, first read this documentation on adding files: https://fleio.com/docs/developer/add-change-docker-files.html#change-docker-files. So, if we follow the linked docs, we add our "messages.{lang}.json" file to the "/home/fleio/compose/custom/" example directory and in the "/home/fleio/compose/custom/Dockerfile" file we'll make sure it is copied in the appropiate location:

```
COPY messages.fr.json "$INSTALL_PATH/frontend/enduser/assets/locale/messages.fr.json"
```

The last step is to update the `availableLanguages` list in panels' config files. On deb/rpm installations simply edit the related files (`/var/webapps/fleio/frontend/enduser/assets/config/enduser.config.json`). On docker installations on fleio, use the following command to edit the config file: `fleio edit enduser.config.json`. Add the the key if it doesn't exist, or update it. For example, it may look like this:

```
{
  ...
  "settings": {
    ...
    "availableLanguages": ["en", "fr"],
    ...
  }
}
```

You can also update the `defaultLanguage` variable and login/signup pages will be changed according to that. Keep in mind that when adding a new language to available languages, or when changing default language of a panel, you need to have the related `messages.{lang}.json` file in the appropiate directory.


### Enabling the new language

In order to enable the new language copy the `LANGUAGES` variable from '/var/webapps/fleio/project/fleio/base_settings.py'
to `/var/webapps/fleio/project/fleio/settings.py` and add your new language there. You can also remove default language 
options from this variable.

After all changes are done restart fleio backend using:

`service uwsgi reload`

On CentOS you will need to run

`service uwsgi-fleio reload`


## License information

fleio-i18n is licensed under BSD License. See the "LICENSE" file for more information.

## Thanks

* Thanks to [Hopla](https://hopla.cloud) for the French translation
* Thanks to [Binero](https://binero.com) for the Swedish translation

