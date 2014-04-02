# for deployment on apache with mod_wsgi
docroot = '/srv/www/physprop'
import sys
sys.path.insert(0, docroot)
import odor_app
application = odor_app.app
