import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score
import joblib
import mlflow
import logging

logger = logging.getLogger(__name__)

def train_model(X, y):
    logger.info("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train robust XGBoost model
    model = xgb.XGBClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss'
    )
    
    logger.info("Training model...")
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_prob)
    
    logger.info(f"Model trained. Acc: {acc:.4f}, F1: {f1:.4f}, ROC_AUC: {roc_auc:.4f}")
    
    # Persist the model
    joblib.dump(model, "xgboost_model.joblib")
    return model, {"accuracy": acc, "f1_score": f1, "roc_auc": roc_auc}
