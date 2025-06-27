from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
from config import app, db
from models import PortfolioItem, Booking, User

# ─── CORS CONFIG ───────────────────────────────────────────────────────────
app.config['CORS_HEADERS'] = 'Content-Type,Authorization'
CORS(app, resources={r"/*": {"origins": "*"}}, expose_headers=["Authorization"], allow_headers=["Content-Type", "Authorization"], supports_credentials=True)

# ─── MAIL CONFIG ───────────────────────────────────────────────────────────
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME='your-email@gmail.com',
    MAIL_PASSWORD='your-app-password',
    MAIL_DEFAULT_SENDER='your-email@gmail.com',
)

# ─── REST API SETUP ────────────────────────────────────────────────────────
api = Api(app)
jwt = JWTManager(app)
mail = Mail(app)

@app.route('/')
def index():
    return "Welcome to the Artify API!"

# ─── USER RESOURCE ─────────────────────────────────────────────────────────
class UserResource(Resource):
    @jwt_required()
    def get(self, id=None):
        current = User.query.get(get_jwt_identity())

        # Fetch specific user by ID
        if id:
            user = User.query.get_or_404(id)
            if user.role == 'creator' or current.role == 'super_admin' or current.id == user.id:
                return {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "bio": user.bio,
                    "skills": user.skills,
                    "rate": user.rate
                }, 200
            return {"message": "Unauthorized"}, 403

        # Fetch users by role if query param exists
        role = request.args.get('role')
        if role:
            users = User.query.filter_by(role=role).all()
            return [{
                "id": u.id,
                "username": u.username,
                "bio": u.bio,
                "skills": u.skills,
                "rate": u.rate
            } for u in users], 200

        # Else return the current user
        return {
            "id": current.id,
            "username": current.username,
            "email": current.email,
            "role": current.role,
            "bio": current.bio,
            "skills": current.skills,
            "rate": current.rate
        }, 200

        # Return all creators
        creators = User.query.filter_by(role='creator').all()
        return [{
            "id": user.id,
            "username": user.username,
            "bio": user.bio,
            "skills": user.skills,
            "rate": user.rate
        } for user in creators], 200

    @jwt_required()
    def put(self, id):
        user = User.query.get_or_404(id)
        current = User.query.get(get_jwt_identity())
        if current.role != 'super_admin' and current.id != user.id:
            return {"message": "Unauthorized"}, 403

        data = request.get_json()
        try:
            user.email = data.get('email', user.email)
            user.bio = data.get('bio', user.bio)
            user.skills = data.get('skills', user.skills)
            user.rate = data.get('rate', user.rate)
            if data.get('password'):
                user.set_password(data['password'])
            db.session.commit()
            return {"message": "Profile updated"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Update failed: {str(e)}"}, 500

    @jwt_required()
    def delete(self, id):
        user = User.query.get_or_404(id)
        current = User.query.get(get_jwt_identity())
        if current.role != 'super_admin' and current.id != user.id:
            return {"message": "Unauthorized"}, 403

        try:
            db.session.delete(user)
            db.session.commit()
            return {"message": "Profile deleted"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Delete failed: {str(e)}"}, 500

# ─── AUTH RESOURCE ─────────────────────────────────────────────────────────
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

        new_user = User(
            username=data['username'],
            email=data['email'],
            role=data.get('role', 'client')
        )
        new_user.set_password(data['password'])
        try:
            db.session.add(new_user)
            db.session.commit()
            token = create_access_token(identity=new_user.id)
            return {"token": token, "role": new_user.role}, 201
        except Exception as e:
            db.session.rollback()
            return {"message": f"Registration failed: {str(e)}"}, 500

# ─── PORTFOLIO RESOURCE ───────────────────────────────────────────────────
class PortfolioItemResource(Resource):
    @jwt_required()
    def get(self, id=None):
        if id:
            it = PortfolioItem.query.get_or_404(id)
            return {
                "id": it.id,
                "title": it.title,
                "image_url": it.image_url,
                "description": it.description,
                "category": it.category,
                "price": it.price,
                "rating": it.rating
            }, 200

        user_id = get_jwt_identity()
        items = PortfolioItem.query.filter_by(user_id=user_id).all()
        return [{
            "id": it.id,
            "title": it.title,
            "image_url": it.image_url,
            "description": it.description,
            "category": it.category,
            "price": it.price,
            "rating": it.rating
        } for it in items], 200

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
        it = PortfolioItem.query.get_or_404(id)
        if it.user_id != get_jwt_identity():
            return {"message": "Unauthorized"}, 403

        data = request.get_json()
        try:
            it.title = data.get('title', it.title)
            it.image_url = data.get('image_url', it.image_url)
            it.description = data.get('description', it.description)
            it.category = data.get('category', it.category)
            it.price = data.get('price', it.price)
            it.rating = data.get('rating', it.rating)
            db.session.commit()
            return {"message": "Item updated"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Update failed: {str(e)}"}, 500

    @jwt_required()
    def delete(self, id):
        it = PortfolioItem.query.get_or_404(id)
        if it.user_id != get_jwt_identity():
            return {"message": "Unauthorized"}, 403

        try:
            db.session.delete(it)
            db.session.commit()
            return {"message": "Item deleted"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Delete failed: {str(e)}"}, 500

# ─── PUBLIC PORTFOLIO ──────────────────────────────────────────────────────
class PublicPortfolioItems(Resource):
    def get(self):
        items = PortfolioItem.query.all()
        return [{
            "id": it.id,
            "title": it.title,
            "image_url": it.image_url,
            "description": it.description,
            "category": it.category,
            "price": it.price,
            "rating": it.rating,
            "user_id": it.user_id,
            "creator": it.user.username if it.user else "Unknown"
        } for it in items], 200

# ─── BOOKING RESOURCE ─────────────────────────────────────────────────────
class BookingResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role == 'creator':
            bs = Booking.query.filter_by(user_id=user_id).all()
        else:
            bs = Booking.query.filter_by(client_id=user_id).all()

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
        } for b in bs], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        client_id = get_jwt_identity()

        new_b = Booking(
            date=data.get('date'),
            time=data.get('time'),
            client_name=data.get('clientName'),
            status='pending',
            user_id=data.get('creatorId'),
            client_id=client_id
        )
        try:
            db.session.add(new_b)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {"message": f"Booking creation failed: {str(e)}"}, 500

        try:
            creator = User.query.get(data.get('creatorId'))
            if creator and creator.email:
                msg = Message("New Booking on Artify", recipients=[creator.email])
                msg.body = f"New booking from {new_b.client_name} on {new_b.date} at {new_b.time}."
                mail.send(msg)
        except Exception as mail_e:
            print("Mail error:", mail_e)

        return {"message": "Booking created", "id": new_b.id}, 201

    @jwt_required()
    def patch(self, id):
        b = Booking.query.get_or_404(id)
        if b.user_id != get_jwt_identity():
            return {"message": "Unauthorized"}, 403

        data = request.get_json()
        try:
            b.status = data.get('status', b.status)
            db.session.commit()
            client = User.query.get(b.client_id)
            if client and client.email:
                msg = Message("Booking Update on Artify", recipients=[client.email])
                msg.body = f"Your booking on {b.date} at {b.time} is now {b.status}."
                mail.send(msg)
            return {"message": "Booking updated", "status": b.status}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Update failed: {str(e)}"}, 500

# ─── REVIEW RESOURCE ──────────────────────────────────────────────────────
class ReviewResource(Resource):
    @jwt_required()
    def post(self, booking_id):
        data = request.get_json()
        b = Booking.query.get_or_404(booking_id)
        if b.client_id != get_jwt_identity():
            return {"message": "Unauthorized"}, 403
        b.review = {"rating": data.get('rating'), "comment": data.get('comment')}
        try:
            db.session.commit()
            return {"message": "Review added"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Review failed: {str(e)}"}, 500

# ─── ROUTES ────────────────────────────────────────────────────────────────
api.add_resource(UserResource, '/users', '/users/<int:id>')
api.add_resource(PortfolioItemResource, '/portfolio-items', '/portfolio-items/<int:id>')
api.add_resource(PublicPortfolioItems, '/public-portfolio-items')
api.add_resource(BookingResource, '/bookings', '/bookings/<int:id>')
api.add_resource(ReviewResource, '/reviews/<int:booking_id>')
api.add_resource(AuthResource, '/auth')

if __name__ == '__main__':
    app.run(debug=True, port=5555)
