import streamlit as st
import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from scipy import sparse

# Page configuration
st.set_page_config(
    page_title="Career Prediction System",
    page_icon="🎓",
    layout="wide"
)

# Load the trained model
@st.cache_resource
def load_model():
    try:
        with open('career_model_labeled.pkl', 'rb') as f:
            model = pickle.load(f)
        return model
    except FileNotFoundError:
        st.error("Model file 'career_model_labeled.pkl' not found. Run 'python create_proper_model.py' first.")
        return None

# Load encoders
@st.cache_resource
def load_encoders():
    try:
        with open('feature_encoder.pkl', 'rb') as f:
            encoder = pickle.load(f)
        with open('feature_scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
        return encoder, scaler
    except FileNotFoundError:
        st.error("Encoder files not found. Run 'python create_proper_model.py' first.")
        return None, None

# Load original data for fitting encoders
@st.cache_data
def load_training_data():
    try:
        data = pd.read_csv("roo_data.csv")
        return data
    except FileNotFoundError:
        st.error("Dataset 'roo_data.csv' not found.")
        return None

# Job categories mapping
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

def main():
    st.title("🎓 Career Prediction System")
    st.markdown("### Predict your ideal IT career path based on your skills and preferences")
    
    # Load model and data
    model = load_model()
    encoder, scaler = load_encoders()
    training_data = load_training_data()
    
    if model is None or encoder is None or scaler is None or training_data is None:
        st.stop()
    
    # Create tabs
    tab1, tab2 = st.tabs(["📝 Prediction", "ℹ️ About"])
    
    with tab1:
        st.markdown("#### Enter your details below:")
        
        # Create columns for better layout
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown("##### 📊 Academic Performance (%)")
            os_score = st.slider("Operating Systems", 0, 100, 70)
            algo_score = st.slider("Algorithms", 0, 100, 70)
            prog_score = st.slider("Programming Concepts", 0, 100, 70)
            se_score = st.slider("Software Engineering", 0, 100, 70)
            networks_score = st.slider("Computer Networks", 0, 100, 70)
            electronics_score = st.slider("Electronics Subjects", 0, 100, 70)
            arch_score = st.slider("Computer Architecture", 0, 100, 70)
            math_score = st.slider("Mathematics", 0, 100, 70)
            comm_score = st.slider("Communication Skills", 0, 100, 70)
        
        with col2:
            st.markdown("##### 💡 Skills & Ratings")
            work_hours = st.slider("Hours working per day", 1, 24, 8)
            logical_rating = st.slider("Logical quotient rating", 1, 10, 5)
            hackathons = st.number_input("Number of hackathons", 0, 20, 0)
            coding_rating = st.slider("Coding skills rating", 1, 10, 5)
            speaking_points = st.slider("Public speaking points", 1, 10, 5)
            
            st.markdown("##### 🎯 Capabilities")
            long_work = st.selectbox("Can work long time before system?", ["yes", "no"])
            self_learning = st.selectbox("Self-learning capability?", ["yes", "no"])
            extra_courses = st.selectbox("Extra-courses did", ["yes", "no"])
            
            st.markdown("##### 📚 Certifications & Activities")
            certifications = st.text_input("Certifications (e.g., machine learning)", "machine learning")
            workshops = st.text_input("Workshops (e.g., data science)", "data science")
            talent_tests = st.selectbox("Talent tests taken?", ["yes", "no"])
            olympiads = st.selectbox("Olympiads", ["yes", "no"])
        
        with col3:
            st.markdown("##### 📖 Skills & Preferences")
            reading_writing = st.selectbox("Reading and writing skills", ["poor", "medium", "excellent"])
            memory_score = st.selectbox("Memory capability score", ["poor", "medium", "excellent"])
            
            st.markdown("##### 🎯 Career Interests")
            interested_subjects = st.text_input("Interested subjects", "data science")
            career_area = st.text_input("Interested career area", "data science")
            job_studies = st.selectbox("Job/Higher Studies?", ["job", "higherstudies"])
            company_type = st.text_input("Type of company want to settle in", "Product based")
            
            st.markdown("##### 👥 Personal Traits")
            senior_input = st.selectbox("Taken inputs from seniors or elders", ["yes", "no"])
            interested_games = st.selectbox("Interested in games", ["yes", "no"])
            book_type = st.text_input("Interested Type of Books", "Mystery")
            salary_range = st.selectbox("Salary Range Expected", ["salary", "Work"])
            relationship = st.selectbox("In a Relationship?", ["yes", "no"])
            behaviour = st.selectbox("Gentle or Tuff behaviour?", ["gentle", "stubborn"])
            mgmt_tech = st.selectbox("Management or Technical", ["Management", "Technical"])
            salary_work = st.selectbox("Salary/work", ["salary", "work"])
            worker_type = st.selectbox("Hard/smart worker", ["hard worker", "smart worker"])
            team_work = st.selectbox("Worked in teams ever?", ["yes", "no"])
            introvert = st.selectbox("Introvert", ["yes", "no"])
        
        # Predict button
        if st.button("🔮 Predict Career Path", type="primary", use_container_width=True):
            with st.spinner("Analyzing your profile..."):
                # Create input dataframe
                input_data = pd.DataFrame({
                    'Acedamic percentage in Operating Systems': [os_score],
                    'percentage in Algorithms': [algo_score],
                    'Percentage in Programming Concepts': [prog_score],
                    'Percentage in Software Engineering': [se_score],
                    'Percentage in Computer Networks': [networks_score],
                    'Percentage in Electronics Subjects': [electronics_score],
                    'Percentage in Computer Architecture': [arch_score],
                    'Percentage in Mathematics': [math_score],
                    'Percentage in Communication skills': [comm_score],
                    'Hours working per day': [work_hours],
                    'Logical quotient rating': [logical_rating],
                    'hackathons': [hackathons],
                    'coding skills rating': [coding_rating],
                    'public speaking points': [speaking_points],
                    'can work long time before system?': [long_work],
                    'self-learning capability?': [self_learning],
                    'Extra-courses did': [extra_courses],
                    'certifications': [certifications],
                    'workshops': [workshops],
                    'talenttests taken?': [talent_tests],
                    'olympiads': [olympiads],
                    'reading and writing skills': [reading_writing],
                    'memory capability score': [memory_score],
                    'Interested subjects': [interested_subjects],
                    'interested career area ': [career_area],
                    'Job/Higher Studies?': [job_studies],
                    'Type of company want to settle in?': [company_type],
                    'Taken inputs from seniors or elders': [senior_input],
                    'interested in games': [interested_games],
                    'Interested Type of Books': [book_type],
                    'Salary Range Expected': [salary_range],
                    'In a Realtionship?': [relationship],
                    'Gentle or Tuff behaviour?': [behaviour],
                    'Management or Technical': [mgmt_tech],
                    'Salary/work': [salary_work],
                    'hard/smart worker': [worker_type],
                    'worked in teams ever?': [team_work],
                    'Introvert': [introvert]
                })
                
                try:
                    # Transform user input using pre-fitted encoders
                    encoded_input = encoder.transform(input_data)
                    scaled_input = scaler.transform(encoded_input)
                    user_input = sparse.csr_matrix.copy(scaled_input)
                    
                    # Make prediction
                    prediction = model.predict(user_input)
                    probabilities = model.predict_proba(user_input)
                    
                    # Display results
                    st.success("✅ Prediction Complete!")
                    
                    st.markdown("---")
                    st.markdown("### 🎯 Your Predicted Career Category")
                    st.markdown(f"## **{prediction[0]}**")
                    
                    # Show confidence scores
                    st.markdown("### 📊 Confidence Scores")
                    prob_df = pd.DataFrame({
                        'Category': model.classes_,
                        'Confidence': probabilities[0] * 100
                    }).sort_values('Confidence', ascending=False)
                    
                    st.bar_chart(prob_df.set_index('Category')['Confidence'])
                    
                    # Show specific job roles
                    st.markdown("### 💼 Possible Job Roles in This Category")
                    if prediction[0] in job_categories:
                        roles = job_categories[prediction[0]]
                        for i, role in enumerate(roles, 1):
                            st.markdown(f"{i}. **{role}**")
                    
                    # Show top 3 categories
                    st.markdown("### 🏆 Top 3 Career Matches")
                    top_3 = prob_df.head(3)
                    for idx, row in top_3.iterrows():
                        st.markdown(f"**{row['Category']}** - {row['Confidence']:.2f}% confidence")
                    
                except Exception as e:
                    st.error(f"Error during prediction: {str(e)}")
                    st.info("Please ensure all fields are filled correctly.")
    
    with tab2:
        st.markdown("""
        ### About This System
        
        This Career Prediction System uses Machine Learning to predict the most suitable IT career path based on:
        
        - **Academic Performance**: Scores in various computer science subjects
        - **Skills & Ratings**: Coding skills, logical thinking, public speaking
        - **Personal Traits**: Work style, learning capability, team collaboration
        - **Interests**: Preferred subjects, career areas, and company types
        
        #### Model Details
        - **Algorithm**: Multi-Layer Perceptron (MLP) Neural Network
        - **Architecture**: 3 hidden layers (50, 50, 50 neurons)
        - **Activation**: tanh
        - **Solver**: Adam optimizer
        - **Categories**: 11 job categories covering various IT roles
        
        #### Job Categories
        """)
        
        for category, roles in job_categories.items():
            with st.expander(f"📁 {category}"):
                for role in roles:
                    st.markdown(f"- {role}")
        
        st.markdown("""
        ---
        #### How to Use
        1. Fill in all your details in the **Prediction** tab
        2. Click the **Predict Career Path** button
        3. View your predicted career category and confidence scores
        4. Explore specific job roles within your predicted category
        
        #### Note
        This system provides suggestions based on patterns in training data. 
        Consider it as guidance alongside your personal interests and career counseling.
        """)

if __name__ == "__main__":
    main()
