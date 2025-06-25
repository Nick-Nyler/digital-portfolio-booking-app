# server/seed.py
from config import app, db
from models import User, Client, PortfolioItem, Booking
from datetime import datetime, time, date

with app.app_context():
    print("🧹 Clearing existing data...")
    Booking.query.delete()
    PortfolioItem.query.delete()
    Client.query.delete()
    User.query.delete()

    print("👤 Seeding users...")
    user1 = User(
        username="creative_moe",
        email="moe@example.com",
        bio="I love photography and digital design.",
        profile_pic_url="https://i.pravatar.cc/150?img=3"
    )
    user1.password = "password123"

    user2 = User(
        username="dev_daisy",
        email="daisy@example.com",
        bio="Web designer and front-end dev.",
        profile_pic_url="https://i.pravatar.cc/150?img=4"
    )
    user2.password = "securepass456"

    print("👥 Seeding clients...")
    client1 = Client(
        name="Lilian Wambui",
        email="lilian@example.com",
        phone="0712345678"
    )
    client1.password = "client123"

    client2 = Client(
        name="Brian Otieno",
        email="brian@example.com",
        phone="0722233344"
    )
    client2.password = "clientpass"

    print("🖼️ Seeding portfolio items...")
    portfolio1 = PortfolioItem(
        user=user1,
        title="Sunset Photography",
        description="A collection of my best sunset shots.",
        image_url="https://source.unsplash.com/featured/?sunset",
        category="Photography"
    )

    portfolio2 = PortfolioItem(
        user=user2,
        title="Minimalist Web Designs",
        description="My favorite clean and simple landing pages.",
        image_url="https://source.unsplash.com/featured/?webdesign",
        category="Design"
    )

    print("📅 Seeding bookings...")
    booking1 = Booking(
        user=user1,
        client=client1,
        date=date.today(),
        time=time(15, 0),
        status="confirmed",
        notes="Outdoor shoot at Karura Forest"
    )

    booking2 = Booking(
        user=user2,
        client=client2,
        date=date.today(),
        time=time(11, 0),
        status="pending",
        notes="Zoom call to discuss the project brief"
    )

    print("💾 Saving to database...")
    db.session.add_all([user1, user2, client1, client2, portfolio1, portfolio2, booking1, booking2])
    db.session.commit()
    print("✅ Done seeding!")
