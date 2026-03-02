from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from app.db.base import Base
from datetime import datetime

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    predicted_label = Column(String, nullable=False)
    probability_score = Column(Float, nullable=False)
    shap_explanation_json = Column(JSON, nullable=True)
    economic_axis_score = Column(Float, nullable=True)
    social_axis_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
