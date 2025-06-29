from config import app, db
from models import PortfolioItem, Booking, User
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()

    # Super admin
    if not User.query.filter_by(username='superadmin').first():
        superadmin = User(
            username='superadmin',
            password=generate_password_hash('admin123'),
            email='superadmin@example.com',
            role='super_admin'
        )
        db.session.add(superadmin)

    # Creator
    creator = User.query.filter_by(username='creator1').first()
    if not creator:
        creator = User(
            username='creator1',
            password=generate_password_hash('creator123'),
            email='creator1@example.com',
            role='creator',
            bio='Passionate artist with 5+ years experience',
            skills='Painting, Photography',
            rate=50.0
        )
        db.session.add(creator)

    # Client
    client = User.query.filter_by(username='client1').first()
    if not client:
        client = User(
            username='client1',
            password=generate_password_hash('client123'),
            email='client1@example.com',
            role='client'
        )
        db.session.add(client)

    db.session.commit()

    # Portfolio items
    if not PortfolioItem.query.filter_by(title='Abstract Canvas').first():
        items = [
            PortfolioItem(
                title='Abstract Canvas',
                image_url='https://via.placeholder.com/150',
                description='Bold abstract art',
                category='Painting',
                price=50.0,
                rating=4.5,
                user_id=creator.id
            ),
            PortfolioItem(
                title='Forest Snapshot',
                image_url='https://via.placeholder.com/150',
                description='Nature photography',
                category='Photography',
                price=30.0,
                rating=4.0,
                user_id=creator.id
            )
        ]
        db.session.add_all(items)
        db.session.commit()

    # Booking
    if not Booking.query.filter_by(date='2025-06-26', client_id=client.id).first():
        booking = Booking(
            date='2025-06-26',
            time='14:00',
            client_name='John Doe',
            user_id=creator.id,
            client_id=client.id,
            status='pending'
        )
        db.session.add(booking)
        db.session.commit()

    print("✅ Database seeded successfully.")
