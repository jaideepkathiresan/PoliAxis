from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.models.responses import QuestionnaireResponse
from app.models.predictions import Prediction
from app.schemas.data import QuestionnaireSubmit, PredictionResult
from app.ml.prediction import predict
from app.ml.explainability import generate_explanation
import pandas as pd
from typing import Any

router = APIRouter()

@router.post("/submit", response_model=PredictionResult)
def submit_questionnaire(
    data: QuestionnaireSubmit, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    # Save the response
    new_response = QuestionnaireResponse(
        user_id=current_user.id,
        **data.dict()
    )
    db.add(new_response)
    db.commit()

    # Convert to DataFrame for ML
    input_df = pd.DataFrame([data.dict()])
    
    # Predict
    try:
        label, prob, X_processed, model = predict(input_df)
        shap_explanation = generate_explanation(model, X_processed)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    # Store Prediction
    prediction_record = Prediction(
        user_id=current_user.id,
        predicted_label=label,
        probability_score=prob,
        shap_explanation_json=shap_explanation,
        economic_axis_score=data.economic_axis_score,
        social_axis_score=data.social_axis_score
    )
    db.add(prediction_record)
    db.commit()
    db.refresh(prediction_record)

    return PredictionResult(
        predicted_label=label,
        probability_score=prob,
        shap_explanation_json=shap_explanation,
        economic_axis_score=data.economic_axis_score,
        social_axis_score=data.social_axis_score
    )

@router.get("/my-results", response_model=PredictionResult)
def get_my_results(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    res = db.query(Prediction).filter(Prediction.user_id == current_user.id).order_by(Prediction.created_at.desc()).first()
    if not res:
        raise HTTPException(status_code=404, detail="No predictions found for this user.")
    
    return PredictionResult(
        predicted_label=res.predicted_label,
        probability_score=res.probability_score,
        shap_explanation_json=res.shap_explanation_json,
        economic_axis_score=res.economic_axis_score,
        social_axis_score=res.social_axis_score
    )
