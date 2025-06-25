from config import app, db
from models import PortfolioItem, Booking, User
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()

    # Seed Users
    admin = User(username='admin', password=generate_password_hash('admin123'), email='admin@example.com')
    creator = User(username='creator1', password=generate_password_hash('creator123'), email='creator1@example.com')
    client = User(username='client1', password=generate_password_hash('client123'), email='client1@example.com')
    db.session.add_all([admin, creator, client])
    db.session.commit()

    # Seed Portfolio Items
    items = [
        PortfolioItem(title='Abstract Painting', image_url='https://via.placeholder.com/150', description='A vibrant abstract piece', category='Painting', user_id=creator.id),
        PortfolioItem(title='Nature Photo', image_url='https://via.placeholder.com/150', description='A serene landscape', category='Photography', user_id=creator.id)
    ]
    db.session.add_all(items)
    db.session.commit()

    # Seed Bookings
    booking = Booking(date='2025-06-26', time='14:00', client_name='John Doe', user_id=creator.id, client_id=client.id)
    db.session.add(booking)
    db.session.commit()