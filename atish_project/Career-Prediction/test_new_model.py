"""
Test the new labeled model
"""
import pickle
import pandas as pd
from scipy import sparse

print("Testing new model with proper labels...")
print("-" * 50)

# Load model and encoders
with open('career_model_labeled.pkl', 'rb') as f:
    model = pickle.load(f)
with open('feature_encoder.pkl', 'rb') as f:
    encoder = pickle.load(f)
with open('feature_scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

print(f"✓ Model loaded: {type(model).__name__}")
print(f"✓ Model classes: {model.classes_}")
print(f"✓ Number of classes: {len(model.classes_)}")

# Create sample input
sample_input = pd.DataFrame({
    'Acedamic percentage in Operating Systems': [70],
    'percentage in Algorithms': [75],
    'Percentage in Programming Concepts': [80],
    'Percentage in Software Engineering': [85],
    'Percentage in Computer Networks': [78],
    'Percentage in Electronics Subjects': [72],
    'Percentage in Computer Architecture': [76],
    'Percentage in Mathematics': [82],
    'Percentage in Communication skills': [70],
    'Hours working per day': [8],
    'Logical quotient rating': [7],
    'hackathons': [2],
    'coding skills rating': [6],
    'public speaking points': [5],
    'can work long time before system?': ['yes'],
    'self-learning capability?': ['yes'],
    'Extra-courses did': ['yes'],
    'certifications': ['machine learning'],
    'workshops': ['data science'],
    'talenttests taken?': ['no'],
    'olympiads': ['no'],
    'reading and writing skills': ['excellent'],
    'memory capability score': ['medium'],
    'Interested subjects': ['data science'],
    'interested career area ': ['data science'],
    'Job/Higher Studies?': ['job'],
    'Type of company want to settle in?': ['Product based'],
    'Taken inputs from seniors or elders': ['yes'],
    'interested in games': ['no'],
    'Interested Type of Books': ['Technical'],
    'Salary Range Expected': ['salary'],
    'In a Realtionship?': ['no'],
    'Gentle or Tuff behaviour?': ['gentle'],
    'Management or Technical': ['Technical'],
    'Salary/work': ['salary'],
    'hard/smart worker': ['smart worker'],
    'worked in teams ever?': ['yes'],
    'Introvert': ['no']
})

# Transform and predict
encoded = encoder.transform(sample_input)
scaled = scaler.transform(encoded)
user_input = sparse.csr_matrix.copy(scaled)

prediction = model.predict(user_input)
probabilities = model.predict_proba(user_input)

print("\n" + "-" * 50)
print("PREDICTION RESULTS:")
print("-" * 50)
print(f"Predicted Category: {prediction[0]}")
print(f"Confidence: {probabilities[0].max() * 100:.2f}%")
print("\nTop 3 Predictions:")
top_3_idx = probabilities[0].argsort()[-3:][::-1]
for idx in top_3_idx:
    print(f"  {model.classes_[idx]}: {probabilities[0][idx] * 100:.2f}%")

print("\n✓ Everything works! Ready to run Streamlit app.")
