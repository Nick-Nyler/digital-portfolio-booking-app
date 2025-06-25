from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from models import db
from routes.portfolio_routes import portfolio_bp
from routes.booking_routes import booking_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Init extensions
    db.init_app(app)
    Migrate(app, db)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(portfolio_bp, url_prefix='/portfolio-items')
    app.register_blueprint(booking_bp, url_prefix='/bookings')

    # ✅ Root route to prevent 404 on homepage
    @app.route('/')
    def index():
        return {'message': '🎨 Welcome to the Artify API!'}, 200

    return app

# Run app
if __name__ == '__main__':
    app = create_app()
    app.run(port=5555, debug=True)
