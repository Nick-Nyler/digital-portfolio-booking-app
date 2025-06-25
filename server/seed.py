from config import app, db
from models import PortfolioItem, Booking, User
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()

    admin = User(username='admin', password=generate_password_hash('admin123'), email='admin@example.com')
    creator = User(username='creator1', password=generate_password_hash('creator123'), email='creator1@example.com')
    client = User(username='client1', password=generate_password_hash('client123'), email='client1@example.com')
    db.session.add_all([admin, creator, client])
    db.session.commit()

    items = [
        PortfolioItem(title='Abstract Canvas', image_url='https://via.placeholder.com/150', description='Bold abstract art', category='Painting', user_id=creator.id, price=50.0, rating=4.5),
        PortfolioItem(title='Forest Snapshot', image_url='https://via.placeholder.com/150', description='Nature photography', category='Photography', user_id=creator.id, price=30.0, rating=4.0)
    ]
    db.session.add_all(items)
    db.session.commit()

    booking = Booking(date='2025-06-26', time='14:00', client_name='John Doe', user_id=creator.id, client_id=client.id)
    db.session.add(booking)
    db.session.commit()
