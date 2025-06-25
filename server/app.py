from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
from config import app, db
from models import PortfolioItem, Booking, User

api = Api(app)
jwt = JWTManager(app)
CORS(app)
mail = Mail(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your-email@gmail.com'  # Replace with your email
app.config['MAIL_PASSWORD'] = 'your-app-password'     # Use App Password for Gmail
app.config['MAIL_DEFAULT_SENDER'] = 'your-email@gmail.com'

class UserResource(Resource):
    @jwt_required()
    def get(self, id=None):
        if id:
            user = User.query.get_or_404(id)
            if user.role == 'creator' or (get_jwt_identity() == user.id or User.query.get(get_jwt_identity()).role == 'super_admin'):
                return {"id": user.id, "username": user.username, "email": user.email, "role": user.role, "bio": user.bio}
            return {"message": "Unauthorized"}, 403
        users = User.query.filter_by(role='creator').all()
        return [{"id": u.id, "username": u.username, "email": u.email, "role": u.role, "bio": u.bio} for u in users]

    @jwt_required()
    def put(self, id):
        user = User.query.get_or_404(id)
        if user.id != get_jwt_identity() and User.query.get(get_jwt_identity()).role != 'super_admin':
            return {"message": "Unauthorized"}, 403
        data = request.get_json()
        try:
            user.email = data.get('email', user.email)
            if data.get('password'):
                user.set_password(data['password'])
            user.bio = data.get('bio', user.bio)
            db.session.commit()
            return {"message": "Profile updated"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Update failed: {str(e)}"}, 500

    @jwt_required()
    def delete(self, id):
        user = User.query.get_or_404(id)
        if user.id != get_jwt_identity() and User.query.get(get_jwt_identity()).role != 'super_admin':
            return {"message": "Unauthorized"}, 403
        try:
            db.session.delete(user)
            db.session.commit()
            return {"message": "Profile deleted"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Delete failed: {str(e)}"}, 500

class AuthResource(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and check_password_hash(user.password, data['password']):
            token = create_access_token(identity=user.id)
            return {"token": token, "role": user.role}, 200
        return {"message": "Invalid credentials"}, 401

    def put(self):
        data = request.get_json()
        if User.query.filter_by(username=data['username']).first():
            return {"message": "Username already exists"}, 400
        new_user = User(username=data['username'], email=data['email'], role=data.get('role', 'client'))
        new_user.set_password(data['password'])
        try:
            db.session.add(new_user)
            db.session.commit()
            token = create_access_token(identity=new_user.id)
            return {"token": token, "role": new_user.role}, 201
        except Exception as e:
            db.session.rollback()
            return {"message": f"Registration failed: {str(e)}"}, 500

class PortfolioItemResource(Resource):
    @jwt_required()
    def get(self, id=None):
        if id:
            item = PortfolioItem.query.get_or_404(id)
            if item.user_id != get_jwt_identity():
                return {"id": item.id, "title": item.title, "image_url": item.image_url, "description": item.description, "category": item.category, "price": item.price, "rating": item.rating}
        items = PortfolioItem.query.filter_by(user_id=get_jwt_identity()).all()
        return [{"id": item.id, "title": item.title, "image_url": item.image_url, "description": item.description, "category": item.category, "price": item.price, "rating": item.rating} for item in items]

    @jwt_required()
    def post(self):
        data = request.get_json()
        if not data.get('user_id'):
            data['user_id'] = get_jwt_identity()
        new_item = PortfolioItem(title=data['title'], image_url=data['image_url'], description=data.get('description'), category=data.get('category'), price=data.get('price', 0.0), rating=data.get('rating', 0.0), user_id=data['user_id'])
        try:
            db.session.add(new_item)
            db.session.commit()
            return {"message": "Item created", "id": new_item.id}, 201
        except Exception as e:
            db.session.rollback()
            return {"message": f"Creation failed: {str(e)}"}, 500

    @jwt_required()
    def put(self, id):
        item = PortfolioItem.query.get_or_404(id)
        if item.user_id != get_jwt_identity():
            return {"message": "Unauthorized"}, 403
        data = request.get_json()
        try:
            item.title = data.get('title', item.title)
            item.image_url = data.get('image_url', item.image_url)
            item.description = data.get('description', item.description)
            item.category = data.get('category', item.category)
            item.price = data.get('price', item.price)
            item.rating = data.get('rating', item.rating)
            db.session.commit()
            return {"message": "Item updated"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Update failed: {str(e)}"}, 500

    @jwt_required()
    def delete(self, id):
        item = PortfolioItem.query.get_or_404(id)
        if item.user_id != get_jwt_identity():
            return {"message": "Unauthorized"}, 403
        try:
            db.session.delete(item)
            db.session.commit()
            return {"message": "Item deleted"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Delete failed: {str(e)}"}, 500

class BookingResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        bookings = Booking.query.filter_by(user_id=user_id).all()
        return [{"id": b.id, "date": b.date, "time": b.time, "client_name": b.client_name, "status": b.status, "review": b.review} for b in bookings]

    @jwt_required()
    def post(self):
        data = request.get_json()
        if not data.get('client_id'):
            data['client_id'] = get_jwt_identity()
        new_booking = Booking(date=data['date'], time=data['time'], client_name=data['clientName'], status='pending', user_id=data['creatorId'], client_id=data['client_id'])
        try:
            db.session.add(new_booking)
            db.session.commit()
            msg = Message("New Booking on Artify", recipients=[User.query.get(new_booking.user_id).email])
            msg.body = f"New booking from {new_booking.client_name} on {new_booking.date} at {new_booking.time}."
            mail.send(msg)
            return {"message": "Booking created", "id": new_booking.id}, 201
        except Exception as e:
            db.session.rollback()
            return {"message": f"Booking creation failed: {str(e)}"}, 500

    @jwt_required()
    def patch(self, id):
        booking = Booking.query.get_or_404(id)
        if booking.user_id != get_jwt_identity():
            return {"message": "Unauthorized"}, 403
        data = request.get_json()
        try:
            booking.status = data.get('status', booking.status)
            db.session.commit()
            msg = Message("Booking Update on Artify", recipients=[User.query.get(booking.client_id).email])
            msg.body = f"Your booking on {booking.date} at {booking.time} is now {booking.status}."
            mail.send(msg)
            return {"message": "Booking updated", "status": booking.status}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Update failed: {str(e)}"}, 500

class ClientBookingResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        bookings = Booking.query.filter_by(client_id=user_id).all()
        return [{"id": b.id, "date": b.date, "time": b.time, "status": b.status, "review": b.review, "creator": User.query.get(b.user_id).username} for b in bookings]

class ReviewResource(Resource):
    @jwt_required()
    def post(self, booking_id):
        data = request.get_json()
        booking = Booking.query.get_or_404(booking_id)
        if booking.client_id != get_jwt_identity():
            return {"message": "Unauthorized"}, 403
        booking.review = {"rating": data.get('rating'), "comment": data.get('comment')}
        try:
            db.session.commit()
            return {"message": "Review added"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Review failed: {str(e)}"}, 500

api.add_resource(UserResource, '/users', '/users/<int:id>')
api.add_resource(PortfolioItemResource, '/portfolio-items', '/portfolio-items/<int:id>')
api.add_resource(BookingResource, '/bookings', '/bookings/<int:id>')
api.add_resource(ClientBookingResource, '/bookings/client')
api.add_resource(ReviewResource, '/reviews/<int:booking_id>')
api.add_resource(AuthResource, '/auth')

if __name__ == '__main__':
    app.run(debug=True, port=5555)
