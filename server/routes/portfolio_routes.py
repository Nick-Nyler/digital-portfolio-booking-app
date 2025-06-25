from flask import Blueprint, request, jsonify
from models.portfolio_item import PortfolioItem
from models import db

portfolio_bp = Blueprint('portfolio_items', __name__)

@portfolio_bp.route('/', methods=['GET'])
def get_items():
    items = PortfolioItem.query.all()
    return jsonify([item.to_dict() for item in items]), 200

@portfolio_bp.route('/<int:id>', methods=['GET'])
def get_item(id):
    item = PortfolioItem.query.get_or_404(id)
    return jsonify(item.to_dict()), 200
