from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from config import app, db, api
from models import User, PortfolioItem, Client, Booking

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
api.add_resource(PortfolioItemsResource, '/portfolio-items')
api.add_resource(PortfolioItemResource, '/portfolio-items/<int:id>')
api.add_resource(BookingsResource, '/bookings')

if name == 'main':
    app.run(port=5555, debug=True)

