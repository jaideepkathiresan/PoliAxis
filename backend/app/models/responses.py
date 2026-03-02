from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from app.db.base import Base
from datetime import datetime

class QuestionnaireResponse(Base):
    __tablename__ = "questionnaire_responses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    age = Column(Integer, nullable=True)
    education_level = Column(String, nullable=True)
    marital_status = Column(String, nullable=True)
    occupation = Column(String, nullable=True)
    relationship_status = Column(String, nullable=True)
    race = Column(String, nullable=True)
    sex = Column(String, nullable=True)
    capital_gain = Column(Float, nullable=True)
    capital_loss = Column(Float, nullable=True)
    hours_per_week = Column(Float, nullable=True)
    native_country = Column(String, nullable=True)
    eqm_score = Column(Float, nullable=True)
    economic_axis_score = Column(Float, nullable=True)
    social_axis_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
