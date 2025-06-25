from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from config import app, db
from models import PortfolioItem, Booking, User

api = Api(app)
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Enable CORS for all routes

# Routes
class PortfolioItemResource(Resource):
    @jwt_required()
    def get(self, id=None):
        if id:
            item = PortfolioItem.query.get_or_404(id)
            if item.user_id != get_jwt_identity():
                return {"message": "Unauthorized"}, 403
            return {"id": item.id, "title": item.title, "image_url": item.image_url, "description": item.description, "category": item.category}
        items = PortfolioItem.query.filter_by(user_id=get_jwt_identity()).all()
        return [{"id": item.id, "title": item.title, "image_url": item.image_url, "description": item.description, "category": item.category} for item in items]

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
        return [{"id": b.id, "date": b.date, "time": b.time, "client_name": b.client_name, "status": b.status} for b in bookings]

    @jwt_required()
    def post(self):
        data = request.get_json()
        if not data.get('client_id'):
            data['client_id'] = get_jwt_identity()  # Default to logged-in user as client
        new_booking = Booking(date=data['date'], time=data['time'], client_name=data['clientName'], status='pending', user_id=get_jwt_identity(), client_id=data.get('client_id'))
        try:
            db.session.add(new_booking)
            db.session.commit()
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
            return {"message": "Booking updated", "status": booking.status}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Update failed: {str(e)}"}, 500

class ClientBookingResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        bookings = Booking.query.filter_by(client_id=user_id).all()
        return [{"id": b.id, "date": b.date, "time": b.time, "status": b.status} for b in bookings]

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
api.add_resource(AuthResource, '/login')

if __name__ == '__main__':
    app.run(debug=True, port=5555)