from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import pickle
from scipy import sparse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model and artifacts
try:
    with open('career_model_labeled.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('feature_encoder.pkl', 'rb') as f:
        encoder = pickle.load(f)
    with open('feature_scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
except Exception as e:
    print(f"Error loading model files: {e}")
    # In a real app, you'd fail harder here, but we'll print for now

# Job categories mapping from original app.py
job_categories = {
    'CRM/Managerial Roles': ['CRM Business Analyst', 'CRM Technical Developer', 'Project Manager', 'Information Technology Manager'],
    'Analyst': ['Business Systems Analyst', 'Business Intelligence Analyst', 'E-Commerce Analyst'],
    'Mobile Applications/ Web Development': ['Mobile Applications Developer', 'Web Developer', 'Applications Developer'],
    'QA/Testing': ['Software Quality Assurance (QA) / Testing', 'Quality Assurance Associate'],
    'UX/Design': ['UX Designer', 'Design & UX'],
    'Databases': ['Database Developer', 'Database Administrator', 'Database Manager', 'Portal Administrator'],
    'Programming/ Systems Analyst': ['Programmer Analyst', 'Systems Analyst'],
    'Networks/ Systems': ['Network Security Administrator', 'Network Security Engineer', 'Network Engineer',
                          'Systems Security Administrator', 'Software Systems Engineer', 'Information Security Analyst'],
    'SE/SDE': ['Software Engineer', 'Software Developer'],
    'Technical Support/Service': ['Technical Engineer', 'Technical Services/Help Desk/Tech Support', 'Technical Support'],
    'others': ['Solutions Architect', 'Data Architect', 'Information Technology Auditor']
}

class PredictionInput(BaseModel):
    # Performance
    os_score: int
    algorithms_score: int
    programming_score: int
    software_eng_score: int
    networks_score: int
    electronics_score: int
    architecture_score: int
    math_score: int
    comm_skills_score: int
    
    # Skills
    work_hours: int
    logical_quotient: int
    hackathons: int
    coding_rating: int
    public_speaking: int
    
    # Categorical
    long_time_before_system: str
    self_learning_capability: str
    extra_courses: str
    certifications: str
    workshops: str
    talent_tests: str
    olympiads: str
    reading_writing_skills: str
    memory_capability: str
    interested_subjects: str
    interested_career_area: str
    job_higher_studies: str
    company_type: str
    taken_inputs_from_seniors: str
    interested_games: str
    interested_books: str
    salary_range: str
    relationship_status: str
    behaviour_type: str
    mgmt_or_tech: str
    salary_or_work: str
    hard_or_smart_worker: str
    worked_in_teams: str
    introvert: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(data: PredictionInput):
    try:
        # Map frontend field names to expected model field names
        input_dict = {
            'Acedamic percentage in Operating Systems': [data.os_score],
            'percentage in Algorithms': [data.algorithms_score],
            'Percentage in Programming Concepts': [data.programming_score],
            'Percentage in Software Engineering': [data.software_eng_score],
            'Percentage in Computer Networks': [data.networks_score],
            'Percentage in Electronics Subjects': [data.electronics_score],
            'Percentage in Computer Architecture': [data.architecture_score],
            'Percentage in Mathematics': [data.math_score],
            'Percentage in Communication skills': [data.comm_skills_score],
            'Hours working per day': [data.work_hours],
            'Logical quotient rating': [data.logical_quotient],
            'hackathons': [data.hackathons],
            'coding skills rating': [data.coding_rating],
            'public speaking points': [data.public_speaking],
            'can work long time before system?': [data.long_time_before_system],
            'self-learning capability?': [data.self_learning_capability],
            'Extra-courses did': [data.extra_courses],
            'certifications': [data.certifications],
            'workshops': [data.workshops],
            'talenttests taken?': [data.talent_tests],
            'olympiads': [data.olympiads],
            'reading and writing skills': [data.reading_writing_skills],
            'memory capability score': [data.memory_capability],
            'Interested subjects': [data.interested_subjects],
            'interested career area ': [data.interested_career_area],
            'Job/Higher Studies?': [data.job_higher_studies],
            'Type of company want to settle in?': [data.company_type],
            'Taken inputs from seniors or elders': [data.taken_inputs_from_seniors],
            'interested in games': [data.interested_games],
            'Interested Type of Books': [data.interested_books],
            'Salary Range Expected': [data.salary_range],
            'In a Realtionship?': [data.relationship_status],
            'Gentle or Tuff behaviour?': [data.behaviour_type],
            'Management or Technical': [data.mgmt_or_tech],
            'Salary/work': [data.salary_or_work],
            'hard/smart worker': [data.hard_or_smart_worker],
            'worked in teams ever?': [data.worked_in_teams],
            'Introvert': [data.introvert]
        }
        
        df = pd.DataFrame(input_dict)
        
        # Preprocessing
        encoded_input = encoder.transform(df)
        scaled_input = scaler.transform(encoded_input)
        user_input = sparse.csr_matrix.copy(scaled_input)
        
        # Prediction
        prediction = model.predict(user_input)[0]
        probabilities = model.predict_proba(user_input)[0]
        
        # Format confidence scores
        confidences = []
        for cat, prob in zip(model.classes_, probabilities):
            confidences.append({"category": cat, "confidence": float(prob * 100)})
        
        confidences.sort(key=lambda x: x['confidence'], reverse=True)
        
        return {
            "prediction": prediction,
            "roles": job_categories.get(prediction, []),
            "top_matches": confidences[:3],
            "all_scores": confidences
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("Starting Career Prediction Backend on http://localhost:8001")
    uvicorn.run(app, host="0.0.0.0", port=8001)
