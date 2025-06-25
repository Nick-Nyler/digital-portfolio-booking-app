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

class PortfolioItemResource(Resource):
    @jwt_required()
    def get(self, id=None):
        if id:
            item = PortfolioItem.query.get_or_404(id)
            if item.user_id != get_jwt_identity():
                return {"message": "Unauthorized"}, 403
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
        new_booking = Booking(date=data['date'], time=data['time'], client_name=data['clientName'], status='pending', user_id=get_jwt_identity(), client_id=data.get('client_id'))
        try:
            db.session.add(new_booking)
            db.session.commit()
            # Send email notification
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
            # Send email notification for status change
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
        return [{"id": b.id, "date": b.date, "time": b.time, "status": b.status, "review": b.review} for b in bookings]

class UserResource(Resource):
    @jwt_required()
    def get(self):
        user = User.query.get_or_404(get_jwt_identity())
        return {"id": user.id, "username": user.username, "email": user.email}

    @jwt_required()
    def put(self):
        user = User.query.get_or_404(get_jwt_identity())
        data = request.get_json()
        try:
            user.email = data.get('email', user.email)
            if data.get('password'):
                user.set_password(data['password'])
            db.session.commit()
            return {"message": "Profile updated"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Update failed: {str(e)}"}, 500

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

class AuthResource(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and check_password_hash(user.password, data['password']):
            token = create_access_token(identity=user.id)
            return {"token": token}, 200
        return {"message": "Invalid credentials"}, 401

api.add_resource(PortfolioItemResource, '/portfolio-items', '/portfolio-items/<int:id>')
api.add_resource(BookingResource, '/bookings', '/bookings/<int:id>')
api.add_resource(ClientBookingResource, '/bookings/client')
api.add_resource(UserResource, '/user')
api.add_resource(ReviewResource, '/reviews/<int:booking_id>')
api.add_resource(AuthResource, '/login')

if __name__ == '__main__':
    app.run(debug=True, port=5555)
