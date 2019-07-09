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

The new language file should be placed somewhere in the Fleio frontend installation directory 
(e.g. `/var/webapps/fleio/frontend/site/translations`) and use **Frontend customization** 
feature available in fleio staff panel at **Settings/General** section to include your `.js` file `index.html` for both
staff and end-user:

`<script src="translations/ro.js"></script>`

You can add it in the "Insert code at the end of the <body> tag" section.

Alternatively you can manually edit `index.html` files for staff and end-user, but then you will have to edit them each
time you update Fleio frontend to avoid losing the changes.


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
