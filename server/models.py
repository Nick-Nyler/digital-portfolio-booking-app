from config import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
import bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.Text)
    profile_pic_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    portfolio_items = db.relationship('PortfolioItem', backref='user', cascade='all, delete-orphan')
    bookings = db.relationship('Booking', backref='user', cascade='all, delete-orphan')
    serialize_rules = ('-portfolio_items.user', '-bookings.user')

    @property
    def password(self):
        raise AttributeError("Password is write-only")

    @password.setter
    def password(self, plain_text):
        self.password_hash = bcrypt.hashpw(plain_text.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))


class PortfolioItem(db.Model, SerializerMixin):
    __tablename__ = 'portfolio_items'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    serialize_rules = ('-user.portfolio_items',)

class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    bookings = db.relationship('Booking', backref='client', cascade='all, delete-orphan')
    serialize_rules = ('-bookings.client',)

    @property
    def password(self):
        raise AttributeError("Password is write-only")

    @password.setter
    def password(self, plain_text):
        self.password_hash = bcrypt.hashpw(plain_text.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))


class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), default='pending')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    serialize_rules = ('-user.bookings', '-client.bookings',)
