from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
import os

app.secret_key = os.environ.get('SECRET_KEY', 'dev-only-key')

db_url = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
if db_url.startswith('postgres://'):
    db_url = db_url.replace('postgres://', 'postgresql://', 1)
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

db = SQLAlchemy()
migrate = Migrate(app, db)
db.init_app(app)


api = Api(app)