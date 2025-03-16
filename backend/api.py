from fastapi import FastAPI
from pydantic import BaseModel
from main_module import customer_emotion_analysis, get_all_emotions, translation

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins for CORS (change if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all domains (Adjust this for security)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


class TextRequest(BaseModel):
    text: str

@app.post("/analyze_emotion")
def analyze_emotion(request: TextRequest):
    return customer_emotion_analysis(request.text)


# Endpoint for getting all emotions
@app.post("/all_emotions")
def all_emotions(request: TextRequest):
    return get_all_emotions(request.text)

class TranslationRequest(BaseModel):
    text: str
    language: str

@app.post("/translate")
def translate(request: TranslationRequest):
    if request.language not  in ["eng_Latn", "default"]:
        feedback = translation(request.text, request.language)
        print(feedback[0]['translation_text'])
        return {
        "result" : customer_emotion_analysis(feedback[0]['translation_text']),
        "translation" : feedback[0]['translation_text']
        }
    return {
        "result" : customer_emotion_analysis(request.text),
        "translation" : request.text
    }
