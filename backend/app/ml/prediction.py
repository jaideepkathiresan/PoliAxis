import joblib
import pandas as pd
import os

def load_model_and_preprocessor():
    if not os.path.exists("xgboost_model.joblib") or not os.path.exists("preprocessor.joblib"):
        from app.ml.data_ingestion import fetch_real_dataset
        from app.ml.preprocessing import preprocess_data
        from app.ml.training import train_model
        df = fetch_real_dataset()
        X, y, _ = preprocess_data(df, fit=True)
        train_model(X, y)
        
    model = joblib.load("xgboost_model.joblib")
    preprocessor = joblib.load("preprocessor.joblib")
    return model, preprocessor

def predict(input_data: pd.DataFrame):
    model, preprocessor = load_model_and_preprocessor()
    
    expected_cols = getattr(preprocessor, 'feature_names_in_', input_data.columns)
    numeric_features = preprocessor.transformers_[0][2]
    categorical_features = preprocessor.transformers_[1][2]
    
    for col in expected_cols:
        if col not in input_data.columns:
            if col in numeric_features:
                input_data[col] = 0.0
            else:
                input_data[col] = 'Unknown'

    X_processed = preprocessor.transform(input_data)
    prob_score = model.predict_proba(X_processed)[:, 1][0]
    
    # Psychological shifting logic (Combining EQM/Pol scores with the real base demographic probability)
    # We use a weighted ensemble logic due to model expecting 'adult' demographics.
    if 'eqm_score' in input_data.columns and 'political_score' in input_data.columns:
        psych_factor = input_data['eqm_score'].iloc[0] / 100.0
        pol_factor = input_data['political_score'].iloc[0] / 100.0
        prob_score = (prob_score * 0.6) + (psych_factor * 0.2) + (pol_factor * 0.2)
        
    label = "High Civic Engagement & Stability Preference" if prob_score > 0.5 else "Risk Averse / Passive Engagement"
    return label, float(prob_score), X_processed, model
