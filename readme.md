This repository contains translations for Fleio - see http://fleio.com for details.


## How to add a new language to fleio

Fleio backend is created with Django and Fleio fronted is created with AngularJS.

### Adding a translation for a new language to backend

Run the following command for the language you want to add from Fleio backend installation directory:

`./manage.py makemessages -l <language_code>`

replace `<language_code>` with the code for your new language (e.g. `ro`, `en`, `fr` ...)

After the command runs successfully a new subdirectory for your language should be created in
locale directory - you can use `Poedit` tool to edit the django.po file for your new language.

Once you are done editing the `django.po` file run the following command: 

`djanngo compilemessages`

to generate the `django.mo` file.


### Adding a translation for a new language to frontend

`gulp` is needed to add a new language to fronted.
The `template.pot` file needed is supplied in this repository 
in `translations/frontend/po directory`.

Create a new `<language_code>.po` file for your language. The `<language_code`
should be replaced with the code for your new language (e.g. `ro`, `en`, `fr` ...)

After you edit the translation file use `gulp translations` to generate `.js` files from `.po` files.
The new language file should be placed somewhere in the frontend installation file and use **Frontend customization** 
feature available in fleio staff panel at **Settings/General** section to include you `.js` file `index.html` for both
staff and end-user:

`<script src="commons/translations/ro.js"></script>`

Alternatively you can manually edit `index.html` files for staff and end-user, but then you will have to edit them each
time you update Fleio frontend to avoid losing the changes.


### Enabling the new language

In order to enable the new language edit the `LANGUAGES` variable from 'settings.py'
or `base_settings.py` and add your new language there.

After all changes are done restart fleio backend using:

`service uwsgi reload`


## License information

fleio-i18n is licensed under BSD License. See the "LICENSE" file for more information.
