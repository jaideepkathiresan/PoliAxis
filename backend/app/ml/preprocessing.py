import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
import joblib

def get_preprocessor(df: pd.DataFrame):
    # Separate numeric and categorical
    numeric_features = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
    if 'class' in numeric_features:
        numeric_features.remove('class')
        
    categorical_features = df.select_dtypes(include=['object', 'category']).columns.tolist()
    if 'class' in categorical_features:
        categorical_features.remove('class')

    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    return preprocessor, numeric_features, categorical_features

def preprocess_data(df: pd.DataFrame, fit=True):
    X = df.drop(columns=['class'])
    # Map class to behavioral tendency (binary classification)
    y = df['class'].apply(lambda x: 1 if str(x).strip() == '>50K' else 0)
    
    if fit:
        preprocessor, num, cat = get_preprocessor(X)
        X_processed = preprocessor.fit_transform(X)
        joblib.dump(preprocessor, "preprocessor.joblib")
        return X_processed, y, preprocessor
    else:
        preprocessor = joblib.load("preprocessor.joblib")
        X_processed = preprocessor.transform(X)
        return X_processed, y, preprocessor
