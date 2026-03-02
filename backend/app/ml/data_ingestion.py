from sklearn.datasets import fetch_openml
import pandas as pd
import logging

logger = logging.getLogger(__name__)

def fetch_real_dataset() -> pd.DataFrame:
    """
    Dynamically fetches a real publicly available demographic/employment dataset.
    We use the UCI Adult dataset from OpenML as our primary source of employment and demographic features.
    """
    logger.info("Fetching real demographic dataset from OpenML...")
    try:
        data = fetch_openml(data_id=1590, as_frame=True, parser='auto')
        df = data.frame
        logger.info(f"Dataset fetched successfully with {len(df)} records.")
        return df
    except Exception as e:
        logger.error(f"Error fetching dataset: {e}")
        raise e
