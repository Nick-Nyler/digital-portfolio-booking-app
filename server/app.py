# server/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from config import app, db, api
from models import User, PortfolioItem, Client, Booking

@app.route('/')
def home():
    return {"message": "Welcome to the Digital Portfolio Booking API"}, 200




@app.route('/signup/user', methods=['POST'])
def signup_user():
    data = request.get_json()
    try:
        new_user = User(
            username=data['username'],
            email=data['email'],
            bio=data.get('bio'),
            profile_pic_url=data.get('profile_pic_url')
        )
        new_user.password = data['password']
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict(), 201
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400

@app.route('/signup/client', methods=['POST'])
def signup_client():
    data = request.get_json()
    try:
        new_client = Client(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone')
        )
        new_client.password = data['password']
        db.session.add(new_client)
        db.session.commit()
        return new_client.to_dict(), 201
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400

# ------------------- LOGIN -------------------

@app.route('/login/user', methods=['POST'])
def login_user():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        return user.to_dict(), 200
    return {"error": "Invalid email or password"}, 401

@app.route('/login/client', methods=['POST'])
def login_client():
    data = request.get_json()
    client = Client.query.filter_by(email=data['email']).first()
    if client and client.check_password(data['password']):
        return client.to_dict(), 200
    return {"error": "Invalid email or password"}, 401






class PortfolioItemsResource(Resource):
    def get(self):
        portfolio_items = PortfolioItem.query.all()
        return [item.to_dict() for item in portfolio_items], 200

    def post(self):
        data = request.get_json()
        new_item = PortfolioItem(
            user_id=data['user_id'],
            title=data['title'],
            description=data['description'],
            image_url=data['image_url'],
            category=data.get('category')
        )
        db.session.add(new_item)
        db.session.commit()
        return new_item.to_dict(), 201

class PortfolioItemResource(Resource):
    def get(self, id):
        item = PortfolioItem.query.get_or_404(id)
        return item.to_dict(), 200

    def patch(self, id):
        item = PortfolioItem.query.get_or_404(id)
        data = request.get_json()
        for key, value in data.items():
            setattr(item, key, value)
        db.session.commit()
        return item.to_dict(), 200

    def delete(self, id):
        item = PortfolioItem.query.get_or_404(id)
        db.session.delete(item)
        db.session.commit()
        return {}, 204

class BookingsResource(Resource):
    def get(self):
        bookings = Booking.query.all()
        return [booking.to_dict() for booking in bookings], 200

    def post(self):
        data = request.get_json()
        new_booking = Booking(
            user_id=data['user_id'],
            client_id=data['client_id'],
            date=data['date'],
            time=data['time'],
            status=data.get('status', 'pending'),
            notes=data.get('notes')
        )
        db.session.add(new_booking)
        db.session.commit()
        return new_booking.to_dict(), 201

# Registering the resources with the API
api.add_resource(PortfolioItemsResource, '/portfolio-items')
api.add_resource(PortfolioItemResource, '/portfolio-items/<int:id>')
api.add_resource(BookingsResource, '/bookings')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
