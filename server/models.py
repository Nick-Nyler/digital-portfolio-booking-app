# server/seed.py

from config import app, db
from models import User, Client, PortfolioItem, Booking
from datetime import datetime, date, time

with app.app_context():
    print("🧹 Clearing old data...")
    Booking.query.delete()
    PortfolioItem.query.delete()
    Client.query.delete()
    User.query.delete()

    print("👤 Creating users...")
    user1 = User(
        username='moreenk',
        email='moreen@example.com',
        bio='Passionate graphic designer.',
        profile_pic_url='https://i.pravatar.cc/150?img=5'
    )
    user1.password = 'password123'

    user2 = User(
        username='brianotieno',
        email='brian@example.com',
        bio='Freelance web developer.',
        profile_pic_url='https://i.pravatar.cc/150?img=6'
    )
    user2.password = 'securepass456'

    print("👥 Creating clients...")
    client1 = Client(
        name='Lilian Wambui',
        email='lilian@example.com'
    )
    client1.password = 'clientpass1'

    client2 = Client(
        name='James Karanja',
        email='james@example.com'
    )
    client2.password = 'clientpass2'

    print("🖼️ Creating portfolio items...")
    portfolio1 = PortfolioItem(
        user=user1,
        title='Wedding Shoot',
        description='Captured special moments at a wedding ceremony.',
        image_url='https://source.unsplash.com/featured/?wedding',
        category='Photography'
    )

    portfolio2 = PortfolioItem(
        user=user2,
        title='E-commerce Website',
        description='Built a fully responsive e-commerce frontend.',
        image_url='https://source.unsplash.com/featured/?website',
        category='Web Development'
    )

    print("📅 Creating bookings...")
    booking1 = Booking(
        user=user1,
        client=client1,
        date=date.today(),
        time=time(14, 0),
        status='confirmed',
        notes='Photo shoot at Arboretum.'
    )

    booking2 = Booking(
        user=user2,
        client=client2,
        date=date.today(),
        time=time(10, 30),
        status='pending',
        notes='Meeting to discuss web project.'
    )

    print("💾 Saving to database...")
    db.session.add_all([
        user1, user2,
        client1, client2,
        portfolio1, portfolio2,
        booking1, booking2
    ])
    db.session.commit()
    print("✅ Done seeding!")
