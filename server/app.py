# server/app.py
from flask import request, jsonify
from config import app, db, api
from flask_cors import CORS 
from models import User, PortfolioItem, Client, Booking
from flask_restful import Resource
import secrets

CORS(app) 

@app.route('/')
def index():
    return "Welcome to the Artify API!"

# ------------------- SIGN UP -------------------

@app.route('/signup/user', methods=['POST'])
def signup_user():
    data = request.get_json()

    required = ['username', 'email', 'password']
    if not all(field in data for field in required):
        return {"error": "Username, email, and password are required."}, 400

    if User.query.filter_by(email=data['email']).first():
        return {"error": "Email already registered."}, 409

    try:
        new_user = User(
            username=data['username'],
            email=data['email'],
            role=data.get('role', 'client')
        )
        new_user.password = data['password']
        db.session.add(new_user)
        db.session.commit()

        return {
            "token": secrets.token_hex(16),
            "user": new_user.to_dict()
        }, 201

    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400


@app.route('/signup/client', methods=['POST'])
def signup_client():
    data = request.get_json()

    required = ['name', 'email', 'password']
    if not all(field in data for field in required):
        return {"error": "Name, email, and password are required."}, 400

    if Client.query.filter_by(email=data['email']).first():
        return {"error": "Email already registered."}, 409

    try:
        new_client = Client(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone')
        )
        new_client.password = data['password']
        db.session.add(new_client)
        db.session.commit()

        return {
            "token": secrets.token_hex(16),
            "client": new_client.to_dict()
        }, 201

    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400

# ------------------- LOGIN -------------------

@app.route('/login/user', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return {"error": "Email and password are required."}, 400

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return {
            "token": secrets.token_hex(16),
            "user": user.to_dict()
        }, 200
    return {"error": "Invalid email or password."}, 401


@app.route('/login/client', methods=['POST'])
def login_client():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return {"error": "Email and password are required."}, 400

    client = Client.query.filter_by(email=email).first()
    if client and client.check_password(password):
        return {
            "token": secrets.token_hex(16),
            "client": client.to_dict()
        }, 200
    return {"error": "Invalid email or password."}, 401


# ------------------- RESOURCES -------------------

class PortfolioItemsResource(Resource):
    def get(self):
        items = PortfolioItem.query.all()
        return [item.to_dict() for item in items], 200

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
        return [b.to_dict() for b in bookings], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = get_jwt_identity()
        new_item = PortfolioItem(
            title=data['title'],
            image_url=data['image_url'],
            description=data.get('description'),
            category=data.get('category'),
            price=data.get('price', 0.0),
            rating=data.get('rating', 0.0),
            user_id=user_id
        )
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

class PublicPortfolioItems(Resource):
    def get(self):
        items = PortfolioItem.query.all()
        return [{
            "id": item.id,
            "title": item.title,
            "image_url": item.image_url,
            "description": item.description,
            "category": item.category,
            "price": item.price,
            "rating": item.rating,
            "user_id": item.user_id,
            "creator": item.user.username if item.user else "Unknown"
        } for item in items]

# ---------------------- BOOKINGS -----------------------

class BookingResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role == 'creator':
            bookings = Booking.query.filter_by(user_id=user_id).all()
        else:
            bookings = Booking.query.filter_by(client_id=user_id).all()

        return [{
            "id": b.id,
            "date": b.date,
            "time": b.time,
            "client_name": b.client_name,
            "status": b.status,
            "review": b.review,
            "creator_id": b.user_id,
            "client_id": b.client_id,
            "creator": User.query.get(b.user_id).username
        } for b in bookings]

    @jwt_required()
    def post(self):
        data = request.get_json()
        client_id = get_jwt_identity()

        new_booking = Booking(
            date=data['date'],
            time=data['time'],
            client_name=data['clientName'],
            status='pending',
            user_id=data['creatorId'],
            client_id=client_id
        )
        try:
            db.session.add(new_booking)
            db.session.commit()

# Register routes with API
api.add_resource(PortfolioItemsResource, '/portfolio-items')
api.add_resource(PortfolioItemResource, '/portfolio-items/<int:id>')
api.add_resource(BookingsResource, '/bookings')

# Run the app
if __name__ == '__main__':
    app.run(port=5000, debug=True)
