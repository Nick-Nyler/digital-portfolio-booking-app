from flask import Blueprint, request, jsonify
from models.booking import Booking
from models import db

booking_bp = Blueprint('bookings', __name__)

@booking_bp.route('/', methods=['GET'])
def get_bookings():
    bookings = Booking.query.all()
    return jsonify([b.to_dict() for b in bookings]), 200

@booking_bp.route('/', methods=['POST'])
def create_booking():
    data = request.get_json()

    try:
        booking = Booking(
            client_name=data['client_name'],
            date=data['date'],
            time=data['time'],
            portfolio_item_id=data['portfolio_item_id']
        )
        db.session.add(booking)
        db.session.commit()
        return jsonify(booking.to_dict()), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400
