# seed.py

from faker import Faker
from models import User, PortfolioItem, Client, Booking, db
from config import app
from datetime import datetime, timedelta, time

fake = Faker()

def seed_database():
    # Clear existing data
    db.session.query(Booking).delete()
    db.session.query(PortfolioItem).delete()
    db.session.query(Client).delete()
    db.session.query(User).delete()

    # Seed User
    user = User(
        username="creator1",
        email="creator1@example.com",
        password="hashedpassword",
        bio="Creative artist",
        profile_pic_url="https://via.placeholder.com/150"
    )
    db.session.add(user)
    db.session.commit()

    # Seed PortfolioItems
    for _ in range(3):
        item = PortfolioItem(
            user_id=user.id,
            title=fake.sentence(),
            description=fake.paragraph(),
            image_url="https://via.placeholder.com/300",
            category=fake.word()
        )
        db.session.add(item)
    db.session.commit()

    # Seed Client
    client = Client(
        name="John Doe",
        email="john@example.com",
        phone="123-456-7890"
    )
    db.session.add(client)
    db.session.commit()

    # Seed Booking
    booking = Booking(
        user_id=user.id,
        client_id=client.id,
        date=datetime.now().date() + timedelta(days=1),
        time=time(hour=14, minute=0),
        status="pending",
        notes="Please confirm"
    )
    db.session.add(booking)
    db.session.commit()

    print("✅ Database seeded successfully!")

# ✅ Main execution block with app context
if __name__ == '__main__':
    with app.app_context():
        seed_database()
