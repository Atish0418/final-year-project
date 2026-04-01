"""
Script to create a properly labeled model for the Streamlit app
"""
import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from scipy import sparse
from imblearn.over_sampling import RandomOverSampler
import warnings
warnings.filterwarnings("ignore")

print("Loading and preparing data...")

# Load data
data = pd.read_csv("roo_data.csv")
x = data.iloc[:,:-1]
y = data.iloc[:,-1]

# Group the job roles into categories
y_trans = y.copy(deep=True)

y_trans = y_trans.replace(['CRM Business Analyst','CRM Technical Developer','Project Manager',
                    'Information Technology Manager'],'CRM/Managerial Roles')
y_trans = y_trans.replace(['Business Systems Analyst','Business Intelligence Analyst','E-Commerce Analyst'],'Analyst')
y_trans = y_trans.replace(['Mobile Applications Developer','Web Developer',
                    'Applications Developer'],'Mobile Applications/ Web Development')
y_trans = y_trans.replace(['Software Quality Assurance (QA) / Testing','Quality Assurance Associate'],'QA/Testing')
y_trans = y_trans.replace(['UX Designer','Design & UX'] , 'UX/Design')
y_trans = y_trans.replace(['Database Developer','Database Administrator',
                    'Database Manager','Portal Administrator'] , 'Databases')
y_trans = y_trans.replace(['Programmer Analyst','Systems Analyst'],'Programming/ Systems Analyst')
y_trans = y_trans.replace(['Network Security Administrator','Network Security Engineer',
                    'Network Engineer','Systems Security Administrator',
                    'Software Systems Engineer','Information Security Analyst'],'Networks/ Systems')
y_trans = y_trans.replace(['Software Engineer','Software Developer'] ,'SE/SDE')
y_trans = y_trans.replace(['Technical Engineer','Technical Services/Help Desk/Tech Support',
                    'Technical Support'],'Technical Support/Service')
y_trans = y_trans.replace(['Solutions Architect','Data Architect','Information Technology Auditor'],'others')

print(f"Categories: {y_trans.unique()}")
print(f"Number of categories: {len(y_trans.unique())}")

# OneHotEncode X
print("\nEncoding features...")
X = OneHotEncoder().fit_transform(x)
X2 = StandardScaler(with_mean=False).fit_transform(X)

# Perform oversampling
print("Performing oversampling...")
X3 = sparse.csr_matrix.copy(X2)
y3 = y_trans.copy(deep=True)

ros = RandomOverSampler(random_state=42)
X_ovs, y_ovs = ros.fit_resample(X3, y3)

print(f"After oversampling: {X_ovs.shape}")

# Train test split
print("\nSplitting data...")
X_train, X_test, y_train, y_test = train_test_split(X_ovs, y_ovs, test_size=0.2, random_state=42)

# Train model
print("\nTraining model...")
clf = MLPClassifier(
    activation='tanh', 
    hidden_layer_sizes=(50,50,50), 
    solver='adam', 
    alpha=0.01,
    random_state=42,
    max_iter=500
)
clf.fit(X_train, y_train)

# Evaluate
from sklearn.metrics import accuracy_score
train_acc = accuracy_score(clf.predict(X_train), y_train)
test_acc = accuracy_score(clf.predict(X_test), y_test)

print(f"\nTraining Accuracy: {train_acc:.4f}")
print(f"Testing Accuracy: {test_acc:.4f}")
print(f"\nModel classes: {clf.classes_}")

# Save the model
print("\nSaving model...")
pickle.dump(clf, open("career_model_labeled.pkl", 'wb'))
print("✓ Model saved as 'career_model_labeled.pkl'")

# Also save encoders for consistency
print("\nSaving encoders...")
encoder = OneHotEncoder(handle_unknown='ignore')
encoder.fit(x)
pickle.dump(encoder, open("feature_encoder.pkl", 'wb'))

scaler = StandardScaler(with_mean=False)
X_encoded = encoder.transform(x)
scaler.fit(X_encoded)
pickle.dump(scaler, open("feature_scaler.pkl", 'wb'))

print("✓ Encoders saved")
print("\nDone! You can now use 'career_model_labeled.pkl' in the Streamlit app.")
