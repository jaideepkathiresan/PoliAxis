from pydantic import BaseModel
from typing import Optional, Dict, Any

class QuestionnaireSubmit(BaseModel):
    age: int
    education_level: str
    marital_status: str
    occupation: str
    relationship_status: str
    race: str
    sex: str
    capital_gain: float
    capital_loss: float
    hours_per_week: float
    native_country: str
    eqm_score: float
    economic_axis_score: float
    social_axis_score: float

class PredictionResult(BaseModel):
    predicted_label: str
    probability_score: float
    shap_explanation_json: Dict[str, Any]
    economic_axis_score: Optional[float] = None
    social_axis_score: Optional[float] = None
    
    class Config:
        from_attributes = True
