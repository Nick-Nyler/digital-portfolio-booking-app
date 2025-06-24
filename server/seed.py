from faker import Faker
from models import User, PortfolioItem, Client, Booking, db
from datetime import datetime, timedelta

fake = Faker()

def seed_database():
    db.session.query(User).delete()
    db.session.query(PortfolioItem).delete()
    db.session.query(Client).delete()
    db.session.query(Booking).delete()

# Seed Users
user = User(username="creator1", email="creator1@example.com", password="hashedpassword", bio="Creative artist", profile_pic_url="https://via.placeholder.com/150")
db.session.add(user)
db.session.commit()

# Seed PortfolioItems
for _ in range(3):
    item = PortfolioItem(user_id=user.id, title=fake.sentence(), description=fake.paragraph(), image_url=f"https://via.placeholder.com/300", category=fake.word())
    db.session.add(item)
db.session.commit()

# Seed Clients
client = Client(name="John Doe", email="john@example.com", phone="123-456-7890")
db.session.add(client)
db.session.commit()

# Seed Bookings
booking = Booking(user_id=user.id, client_id=client.id, date=datetime.now() + timedelta(days=1), time="14:00:00", status="pending", notes="Please confirm")
db.session.add(booking)
db.session.commit()
if name == 'main':
    seed_database()
    print("Database seeded!")

