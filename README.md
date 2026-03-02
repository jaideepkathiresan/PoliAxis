# PsychoPolitical Analytics Platform

## Overview

The **PsychoPolitical Analytics Platform** is a research-oriented behavioral science and data analytics application designed to evaluate, plot, and analyze political ideology. Through a comprehensive 6-stage psychological schema assessment paired with a structured demographic survey, the engine calculates an individual's ideological coordinates and dynamically maps them across a Cartesian political compass.

Beyond visual profiling, the application acts as an intelligent data pipeline. User responses and demographic inputs are routed through a FastAPI backend directly into an XGBoost Machine Learning model. The system predicts behavioral classifications using real-world baseline data and utilizes **SHAP (SHapley Additive exPlanations)** to provide transparent, explainable AI insights detailing exactly which socioeconomic factors influenced the model's logic.

## Key Features

- **Dynamic Political Compass Assessment**: A finely tuned, weighted scoring algorithm calculates a continuous numerical rating [-10.0 to 10.0] tracking an individual's stance on both the Economic Axis (Left vs. Right) and the Social Axis (Authoritarian vs. Libertarian).
- **Interactive Visualizations**: Generates dynamic, responsive UI insights, plotting the exact Cartesian coordinates onto a 2D compass mapping interface along with historical references and ideology breakdowns.
- **Explainable AI (XAI)**: Demystifies behavioral predictions by calculating feature importances through SHAP mapping to explain which specific user demographics heavily weighted the final XGBoost inference.
- **Robust Full-Stack Pipeline**: 
  - **Frontend**: Utilizes modern **Next.js 14** paired with **Tailwind CSS** for an elegant, theme-adaptive (Light/Dark mode) responsive UI layer.
  - **Backend**: Employs **FastAPI** for high-performance asynchronous API endpoints, leveraging **SQLAlchemy** for ORM database operations (SQLite/PostgreSQL) and seamlessly integrating the Python data-science ecosystem (`pandas`, `scikit-learn`, `xgboost`, `shap`).

---

## Quick Start Guide

The platform is divided into two primary environments: a Python-based backend API and a Node-based frontend application. Follow the localized environment steps below to boot the system natively.

### Prerequisites
- Python 3.11+
- Node.js 20+

### 1. Booting the Backend (API & Machine Learning Engine)

The backend handles authentication, survey scoring persistence, and ML predictions. On its first initialization, the system will automatically scaffold the local SQLite database.

```bash
cd backend
python -m venv venv
# Activate the Environment
# On Windows:
.\venv\Scripts\activate
# On macOS / Linux:
# source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*The API structure and Swagger documentation will now be available at `http://localhost:8000/docs`.*

### 2. Booting the Frontend (User Interface)

The frontend handles complex state management, data visualization, and coordinates the survey logic prior to passing normalized payloads to the API.

```bash
cd frontend
npm install
npm run dev
```

*The frontend application will now be live and accessible at `http://localhost:3000`.*

---

## Technical Architecture

### Directory Structure

```text
PsychoPolitical-Analytics-Platform
 ┣ backend
 ┃ ┣ app               # FastAPI backend architecture
 ┃ ┃ ┣ api             # API routing schemas
 ┃ ┃ ┣ core            # Core config & authentication utilities
 ┃ ┃ ┣ db              # SQLAlchemy database sessions
 ┃ ┃ ┣ ml              # XGBoost training & SHAP generation pipelines
 ┃ ┃ ┣ models          # SQLAlchemy database models (Users, Predictions, Responses)
 ┃ ┃ ┗ schemas         # Pydantic data validation schemas
 ┃ ┗ requirements.txt  # Python package specifications
 ┗ frontend
   ┣ app               # Next.js App Router (Pages: Dashboard, Test, Results)
   ┣ components        # Reusable React components (Charts, Modals, Interstitials)
   ┣ lib               # Frontend utilities and styling macros
   ┣ services          # Axios API wrappers tailored for authentication & state caching
   ┣ package.json      # Node.js dependencies
   ┗ tailwind.config.ts # Core styling matrices
```

## Security & Ethics
- **Data Privacy**: No user demographic payload data collected during the test is monetized or distributed. User metrics are strictly passed structurally through model constraints to return predictions directly to the active session.
- **Authentication**: Stateless structural security via cryptographically hashed passwords (`bcrypt`) coupled with securely transmitted `HTTP-Only` JSON Web Tokens (JWT) for routing authentication.
