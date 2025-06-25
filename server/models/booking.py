from models import db

class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default="Pending")
    portfolio_item_id = db.Column(db.Integer, db.ForeignKey('portfolio_items.id'))

    def to_dict(self):
        return {
            "id": self.id,
            "client_name": self.client_name,
            "date": self.date,
            "time": self.time,
            "status": self.status,
            "portfolio_item_id": self.portfolio_item_id
        }
