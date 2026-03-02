import shap
import json

def generate_explanation(model, X_processed, feature_names=None):
    # SHAP explainer for trees
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_processed)
    
    # Convert to a dictionary for simple JSON return
    # Since X_processed could be sparse from OneHot, we handle safely
    import numpy as np
    
    # Return top 5 influential features globally for the single instance
    try:
        if type(shap_values) is list:
            vals = shap_values[1][0]
        else:
            vals = shap_values[0]
            
        feature_importance = {}
        if hasattr(X_processed, "toarray"):
            dense_X = X_processed.toarray()[0]
        else:
            dense_X = X_processed[0]
            
        for i, val in enumerate(vals):
            feature_importance[f"feature_{i}"] = float(val)
            
        return {"shap_base_value": float(explainer.expected_value[1] if type(explainer.expected_value) is list else explainer.expected_value), "feature_impacts": feature_importance}
    except Exception as e:
        return {"error": str(e), "message": "SHAP not computable for this pipeline layout."}
