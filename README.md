# Express-AI: Customer Emotion Analysis System

## Introduction
Express-AI is a Customer Emotion Analysis System designed to analyze customer feedback and detect emotions using deep learning models. Additionally, it provides multilingual translation support to process text efficiently. The system is built using FastAPI, Hugging Face Transformers, and Vite for frontend development.

## Features
- **Emotion Detection**: Identifies customer emotions using EmoRoBERTa.
- **Text Translation**: Uses NLLB-200 to translate customer feedback.
- **FastAPI Integration**: Provides an API to interact with the models.
- **Frontend UI**: A web interface built with Vite and JavaScript.
- **Real-time Analysis**: Processes feedback instantly and provides emotion insights.
- **Multi-language Support**: Can translate and analyze text in various languages.

## System Requirements
- Python < 3.13
- Node.js & npm
- pip
- FastAPI
- Transformers (Hugging Face)
- TensorFlow / PyTorch
- Uvicorn
- Vite (Frontend)

## Installation Guide

### 1. Install Backend Dependencies
Navigate to the backend folder and create a virtual environment:
```sh
python -m venv .venv
source .venv/bin/activate
```
Install the required dependencies:
```sh
pip install -r requirements.txt
pip install torch
```

Then, create an account on Hugging Face and generate an access token with read and write permissions. Login using:
```sh
huggingface-cli login
```
Paste the generated token in the terminal.

### 2. Model Setup
Download and save the emotion analysis and translation models:
```sh
python model_EmoRoBERTa.py
python model_NLLB-200.py
```
The models will be stored in the local system under the `./Models/` folder.

### 3. Run the Backend API Server
```sh
cd backend
uvicorn api:app --reload
```

### 4. Setup and Run the Frontend
```sh
cd frontend
npm install
npm run dev
```

## Project Structure
```
expressai-linux/
│── backend/                 
│   ├── api.py               
│   ├── model_EmoRoBERTa.py                
│   ├── model_NLLB-200.py    
│   ├── feedback_analysis.json 
│   ├── topics.json          
│   ├── requirements.txt     
│
│── frontend/                
│   ├── src/                 
│   │   ├── components/
│   │   │   ├── AdoreScore.jsx
│   │   │   ├── AnalysisDashboard.jsx
│   │   │   ├── Data.jsx
│   │   │   ├── DropDown.jsx
│   │   │   ├── RadarChartComponents.jsx
│   │   │   ├── Themes.jsx      
│   │   ├── pages/           
│   │   ├── App.vue          
│   │   ├── main.js          
│   ├── index.html           
│   ├── vite.config.js       
│   ├── package.json         
│   ├── package-lock.json    
│   ├── README.md            
│   ├── eslint.config.js     
│   ├── node_modules/        
│
│── requirements.txt
```

## Machine Learning Models Used

### 1. Emotion Analysis Model: EmoRoBERTa
- **Model**: `arpanghoshal/EmoRoBERTa`
- **Purpose**: Classifies customer feedback into various emotion categories such as joy, anger, sadness, fear, and neutral.

### 2. Translation Model: Facebook NLLB-200
- **Model**: `facebook/nllb-200-distilled-600M`
- **Purpose**: Translates text between multiple languages with high accuracy.

## Conclusion
Express-AI is a robust emotion analysis system that combines NLP, Machine Learning, and APIs to enhance customer feedback interpretation. With the addition of the frontend, users can now interact with the system via a user-friendly web interface.

