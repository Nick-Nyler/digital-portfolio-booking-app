from models import db

class PortfolioItem(db.Model):
    __tablename__ = 'portfolio_items'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    image_url = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))

    bookings = db.relationship('Booking', backref='portfolio_item', cascade='all, delete')

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "image_url": self.image_url,
            "description": self.description,
            "category": self.category
        }
