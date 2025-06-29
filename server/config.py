# config.py
import os
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api

# 1) Force-load .env from this file's directory
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# 2) Read DATABASE_URL (Postgres) — error if missing
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    raise RuntimeError(
        "❌ DATABASE_URL is not set in your environment. "
        "Please add it to server/.env (e.g. postgresql:///artify_dev)"
    )

# 3) Spin up Flask + SQLAlchemy
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')

db      = SQLAlchemy(app)
migrate = Migrate(app, db)
api     = Api(app)
