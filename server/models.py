from config import db
from werkzeug.security import generate_password_hash

class PortfolioItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    price = db.Column(db.Float, default=0.0)
    rating = db.Column(db.Float, default=0.0)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    client_name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='pending')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    client_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    review = db.Column(db.JSON)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    portfolio_items = db.relationship('PortfolioItem', backref='user', lazy=True)
    bookings = db.relationship('Booking', backref='user', lazy=True, foreign_keys=[Booking.user_id])
    client_bookings = db.relationship('Booking', backref='client', lazy=True, foreign_keys=[Booking.client_id])

    def set_password(self, password):
        self.password = generate_password_hash(password)
