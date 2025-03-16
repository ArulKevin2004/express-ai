import spacy
import os
import json
from transformers import pipeline
from collections import defaultdict
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
from rapidfuzz import process

# Load Emotion Classification Model
model_path = "./Models/EmoRoBERTa"
classifier = pipeline("text-classification", model=model_path, top_k=None)

local_directory = "./Models/nllb-200-distilled-600M/"

# Load the model and tokenizer from the local directory
model = AutoModelForSeq2SeqLM.from_pretrained(local_directory)
tokenizer = AutoTokenizer.from_pretrained(local_directory)


# Load spaCy model for NLP processing
nlp = spacy.load("en_core_web_lg")

def get_all_emotions(text):
    """Extract all detected emotions from the classifier."""
    results = classifier(text, truncation=True, max_length=512)[0]
    emotions = sorted(results, key=lambda x: x['score'], reverse=True)

    # Convert results into a structured format
    emotions_list = [{"emotion": e['label'], "intensity": round(e['score'], 5)} for e in emotions]

    # Convert to JSON string
    return json.dumps({"emotions": emotions_list}, indent=4)


# Define industry-based topic keywords (expandable)
INDUSTRY_TOPICS = {
    "E-commerce": ["order", "shipping", "delivery", "refund", "cart", "checkout","quality","clothes"],
    "Healthcare": ["doctor", "hospital", "appointment", "medication", "treatment", "nurse","surgery"],
    "Finance": ["bank", "loan", "interest", "credit", "investment", "insurance"],
    "Technology": ["software", "hardware", "AI", "machine learning", "app", "cloud"],
    "Retail": ["store", "customer service", "product", "price", "discount", "return"],
    "Transportation": ["flight", "taxi", "uber", "train", "bus", "airport"],
    "Food & Beverage": ["restaurant", "menu", "food", "chef", "waiter", "service"],
    "Entertainment": ["movie", "concert", "music", "sports", "streaming", "Netflix"],
}

# Define subtopic keywords (expandable)
INDUSTRY_SUBTOPICS = {
    "E-commerce": ["fast", "slow", "delayed", "on-time", "quick", "damaged", "returned","amazing"],
    "Healthcare": ["long", "friendly", "unfriendly", "expensive", "compassionate"],
    "Finance": ["high", "low", "easy", "fraud"],
    "Technology": ["buggy", "smooth", "fast", "laggy", "crash"],
    "Retail": ["great", "poor", "customer-friendly", "overpriced"],
    "Transportation": ["on time", "delayed", "comfortable", "rude"],
    "Food & Beverage": ["delicious", "bad", "fast", "slow"],
    "Entertainment": ["great", "amazing", "boring", "exciting"],
}

def extract_keywords(text):
    """Refined function to extract individual keywords (nouns, adjectives)"""
    doc = nlp(text.lower())
    keywords = [token.text for token in doc if token.pos_ in {"NOUN", "ADJ"} and not token.dep_ in {"aux", "det", "cc", "conj"}]
    print("Refined Extracted Keywords:", keywords)
    return keywords

def detect_industry(text):
    """
    Detects the most relevant industry based on extracted keywords.
    """
    industry_scores = defaultdict(int)
    doc = nlp(text.lower())

    for token in doc:
        for industry, keywords in INDUSTRY_TOPICS.items():
            if token.lemma_ in keywords:
                industry_scores[industry] += 1

    return max(industry_scores, key=industry_scores.get) if industry_scores else "General"

def extract_topics_and_subtopics(text):
    """
    Extracts topics and subtopics dynamically from a given text.
    """
    # Detect Industry
    industry = detect_industry(text)

    # Extract Named Entities & Keywords
    doc = nlp(text)
    named_entities = [ent.text.lower() for ent in doc.ents]
    keywords = extract_keywords(text)
    # Print keywords to debug
    print("Extracted Keywords:", keywords)


    # Match Extracted Words to Industry Topics
    detected_topics = set()
    for keyword in keywords + named_entities:
        match_result = process.extractOne(keyword, INDUSTRY_TOPICS.get(industry, []), score_cutoff=60)
        if match_result:
            detected_topics.add(match_result[0])

    # Extract Subtopics Using Dependency Parsing
    subtopics = {topic: [] for topic in detected_topics}

    for token in doc:
        if token.pos_ in ["ADJ", "ADV"]:
            if token.head.text.lower() in detected_topics:
                print(token.lemma_)
                subtopics[token.head.text.lower()].append(token.text)

        # Check for industry-specific subtopics
        # if token.lemma_ in INDUSTRY_SUBTOPICS.get(industry, []):
        #     for topic in detected_topics:
        #         if topic in text:
        #             subtopics[topic].append(token.text)

    return {"industry": industry, "main": list(detected_topics), "subtopics": subtopics}

# Emotion Activation Levels
high = ['excitement', 'desire', 'joy', 'confidence', 'anger', 'fear', 'nervousness', 'annoyance', 'surprise']
medium = ['amusement', 'gratitude', 'pride', 'trust', 'optimism', 'disappointment', 'disapproval', 'embarrassment', 'remorse', 'curiosity', 'realization', 'neutral']
low = ['admiration', 'caring', 'love', 'relief', 'approval', 'sadness', 'grief', 'disgust', 'confusion']

def activation_level(label):
    if label in high:
        return "High"
    elif label in medium:
        return "Medium"
    elif label in low:
        return "Low"
    else:
        return "Unknown"

def analyze_emotions(text):
    results = classifier(text, truncation=True, max_length=512)[0]
    results.sort(key=lambda x: x['score'], reverse=True)

    primary = results[0]
    secondary = results[1] if len(results) > 1 else None

    emotions = {
        "primary": {
            "emotion": primary['label'].capitalize(),
            "activation": activation_level(primary['label'].lower()),
            "intensity": round(primary['score'], 2)
        }
    }

    if secondary:
        emotions["secondary"] = {
            "emotion": secondary['label'].capitalize(),
            "activation": activation_level(secondary['label'].lower()),
            "intensity": round(secondary['score'], 2)
        }

    return emotions

emotion_scores = {
    "confusion": -5, "nervousness": -10, "disappointment": -15, "disapproval": -18, "embarrassment": -20,
    "remorse": -22, "fear": -25, "sadness": -28, "grief": -30, "disgust": -32, "annoyance": -35, "anger": -40,
    "realization": 5, "curiosity": 8, "desire": 10, "caring": 12, "surprise": 15, "approval": 18, "relief": 20,
    "optimism": 22, "pride": 25, "amusement": 28, "excitement": 30, "admiration": 32, "gratitude": 35,
    "love": 38, "joy": 40, "neutral": 0
}

def compute_adorescore(emotions, topics):
    base_score = 50
    emotion_modifier = emotion_scores.get(emotions["primary"]["emotion"].lower(), 0)
    score = base_score + emotion_modifier

    topic_scores = {topic: score + 5 for topic in topics["main"]}

    return {"overall": score, "breakdown": topic_scores}

def customer_emotion_analysis(text):
    emotions = analyze_emotions(text)
    topics = extract_topics_and_subtopics(text)
    adorescore = compute_adorescore(emotions, topics)

    output = {
        "emotions": emotions,
        "topics": topics,
        "adorescore": adorescore
    }

    return json.dumps(output, indent=2)
    
def translation(feedback,lang):
    # Create the pipeline using the locally saved model
    translator = pipeline("translation", model=model, tokenizer=tokenizer, src_lang=lang,tgt_lang="eng_Latn",max_length=4000)
    text = translator(feedback)
    print(text)
    return text

if __name__ == "__main__":
    feedbacks = [
        "The delivery was incredibly fast and the quality was amazing! However, one of the clothing items didn't fit well."
    ]

    results = []
    for feedback in feedbacks:
        # text = translation(feedback,lang)
        result = customer_emotion_analysis(feedback)
        results.append(json.loads(result))

    with open("feedback_analysis_1.json", "w", encoding="utf-8") as file:
        json.dump(results, file, indent=4, ensure_ascii=False)

    print("✅ Feedback analysis saved to 'feedback_analysis.json' successfully!")
    