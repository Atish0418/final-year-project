# Quick Start Guide - Career Prediction Web App

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies (1 minute)
```bash
pip install streamlit pandas numpy scikit-learn scipy imbalanced-learn
```

### Step 2: Create the Model (2-3 minutes)
```bash
python create_proper_model.py
```

You should see:
```
✓ Model saved as 'career_model_labeled.pkl'
✓ Encoders saved
Training Accuracy: 0.9986
Testing Accuracy: 0.7835
```

### Step 3: Run the App (instant)
```bash
streamlit run app.py
```

Or on Windows, double-click: `run_app.bat`

The app will open at: http://localhost:8501

## ✅ Verify Everything Works

Test the model:
```bash
python test_new_model.py
```

Expected output:
```
✓ Model loaded: MLPClassifier
✓ Model classes: ['Analyst' 'CRM/Managerial Roles' ...]
Predicted Category: Networks/ Systems
Confidence: 59.75%
✓ Everything works! Ready to run Streamlit app.
```

## 📝 Using the App

1. Open http://localhost:8501 in your browser
2. Fill in your details in the three columns:
   - **Column 1**: Academic scores (9 subjects)
   - **Column 2**: Skills, certifications, activities
   - **Column 3**: Career interests and personal traits
3. Click "Predict Career Path"
4. View your results:
   - Predicted career category
   - Confidence scores (bar chart)
   - Specific job roles
   - Top 3 matches

## 🎯 Example Input

Try these values for a quick test:
- Operating Systems: 70%
- Algorithms: 75%
- Programming: 80%
- Certifications: "machine learning"
- Workshops: "data science"
- Interested subjects: "data science"
- Career area: "data science"

## 🔧 Troubleshooting

**Problem**: Model files not found
**Solution**: Run `python create_proper_model.py`

**Problem**: Import errors
**Solution**: `pip install -r requirements.txt`

**Problem**: NumPy version error
**Solution**: `pip install "numpy<2.0" "pandas<3.0"`

**Problem**: Port 8501 in use
**Solution**: `streamlit run app.py --server.port 8502`

## 📊 What You Get

The app predicts one of 11 IT career categories:
1. Analyst
2. CRM/Managerial Roles
3. Databases
4. Mobile Applications/Web Development
5. Networks/Systems
6. Programming/Systems Analyst
7. QA/Testing
8. SE/SDE (Software Engineer/Developer)
9. Technical Support/Service
10. UX/Design
11. Others (Architects, Auditors)

## 🎓 Model Performance

- Training Accuracy: 99.8%
- Test Accuracy: 78.4%
- Based on 20,000 training samples
- 38 input features
- 11 output categories

## 💡 Tips for Best Results

1. Be honest with your scores and preferences
2. Fill in all fields accurately
3. Use realistic values for your skills
4. Consider the top 3 predictions, not just #1
5. Use results as guidance, not absolute truth

## 📱 Access from Other Devices

To access from phone/tablet on same network:
```bash
streamlit run app.py --server.address 0.0.0.0
```

Then visit: `http://YOUR_COMPUTER_IP:8501`

## 🌐 Deploy Online (Optional)

### Free Deployment on Streamlit Cloud:
1. Push code to GitHub
2. Visit https://share.streamlit.io
3. Connect your repository
4. Click "Deploy"

Your app will be live at: `https://your-app.streamlit.app`

## 📁 Required Files

Make sure you have:
- ✅ `app.py` - Main application
- ✅ `create_proper_model.py` - Model creation script
- ✅ `roo_data.csv` - Training data
- ✅ `requirements.txt` - Dependencies

After running create_proper_model.py, you'll also have:
- ✅ `career_model_labeled.pkl` - Trained model
- ✅ `feature_encoder.pkl` - Feature encoder
- ✅ `feature_scaler.pkl` - Feature scaler

