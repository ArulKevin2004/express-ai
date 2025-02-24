import spacy
import os
from transformers import pipeline
import json
from rapidfuzz import fuzz
from collections import defaultdict

# Use a pipeline as a high-level helper
from transformers import pipeline

model_path ="./Models/EmoRoBERTa" 

classifier = pipeline("text-classification", model=model_path,top_k=None )

def get_all_emotions(text):
    """Extract all detected emotions from the classifier."""
    results = classifier(text, truncation=True, max_length=512)[0]
    emotions = sorted(results, key=lambda x: x['score'], reverse=True)
    
    # Convert results into a structured format
    emotions_list = [{"emotion": e['label'], "intensity": round(e['score'], 5)} for e in emotions]
    
    # Convert to JSON string
    return json.dumps({"emotions": emotions_list}, indent=4)


# Load spaCy model
nlp = spacy.load("en_core_web_lg")

high = ['excitement', 'desire', 'joy', 'confidence', 'anger', 'fear', 'nervousness', 'annoyance', 'surprise']
medium = ['amusement', 'gratitude', 'pride', 'trust', 'optimism', 'disappointment', 'disapproval', 'embarrassment', 'remorse', 'curiosity','realization','neutral']
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

# 1) Load the entire JSON instead of a single industry
def load_all_topics():
    with open("./topics.json", "r") as file:
        return json.load(file)

def identify_industry(text):
  all_topics = load_all_topics()
  doc = nlp(text.lower())

  best_industry = None
  best_score = 0

  for industry, topics in all_topics.items():
      score = 0
      for token in doc:
          token_lemma = token.lemma_
          for keywords in topics.values():
              for keyword in keywords:
                  match_score = fuzz.partial_ratio(token_lemma, keyword)
                  if match_score > 70:  # Adjust threshold as needed
                      score += 1

      if score > best_score:
          best_score = score
          best_industry = industry

  return best_industry

def extract_topics(text):
    """
    1. Identify the best-matching industry for the given text.
    2. Load that industry's topics from topics.json.
    3. Extract matched topics/subtopics from the text.
    4. Return a dict in the format:
       {
         "industry": "...",
         "topics": {
           "main": [...],
           "subtopics": { "TopicName": [...], ... }
         }
       }
    """
    all_topics = load_all_topics()
    chosen_industry = identify_industry(text)

    # If no industry found or no keywords matched, return empty
    if not chosen_industry:
        return {
            "industry": None,
            "topics": {
                "main": [],
                "subtopics": {}
            }
        }

    # Now load the chosen industry's topics
    topics_for_industry = all_topics[chosen_industry]

    extracted_topics = defaultdict(list)
    doc = nlp(text.lower())

    # Match tokens to the relevant subtopic keywords
    for token in doc:
        token_lemma = token.lemma_
        for topic_name, keywords in topics_for_industry.items():
            if token_lemma in keywords:
                extracted_topics[topic_name].append(token_lemma)

    # Build the final output structure
    return {
        # "industry": chosen_industry,
        "main": list(extracted_topics.keys()),
        "subtopics": dict(extracted_topics)
    }

emotion_scores = {
    # Negative emotions (Increasing negativity)
    "confusion": -5,
    "nervousness": -10,
    "disappointment": -15,
    "disapproval": -18,
    "embarrassment": -20,
    "remorse": -22,
    "fear": -25,
    "sadness": -28,
    "grief": -30,
    "disgust": -32,
    "annoyance": -35,
    "anger": -40,

    # Positive emotions (Increasing positivity)
    "realization": 5,
    "curiosity": 8,
    "desire": 10,
    "caring": 12,
    "surprise": 15,
    "approval": 18,
    "relief": 20,
    "optimism": 22,
    "pride": 25,
    "amusement": 28,
    "excitement": 30,
    "admiration": 32,
    "gratitude": 35,
    "love": 38,
    "joy": 40,

    # Neutral Emotion
    "neutral": 0
}

def compute_adorescore(emotions, topics):
    base_score = 50
    emotion_modifier = emotion_scores.get(emotions["primary"]["emotion"].lower(), 0)
    score = base_score + emotion_modifier
    topic_scores = {topic: score + 5 for topic in topics["main"]}

    return {"overall": score, "breakdown": topic_scores}

def customer_emotion_analysis(text):
    emotions = analyze_emotions(text)
    topics = extract_topics(text)
    adorescore = compute_adorescore(emotions, topics)

    output = {
        "emotions": emotions,
        "topics": topics,
        "adorescore": adorescore
    }

    return json.dumps(output, indent=2)

if __name__ == "__main__":
    # feedback = "The delivery was incredibly fast and the quality was amazing! However, one of the clothing items didn't fit well."
    # feedback_texts = ["My package was delivered three days early, and I loved the eco-friendly packaging!"]

    feedback_texts = [
    # E-commerce
    "I ordered a phone case, and it arrived damaged. The return process was confusing, and customer support was unhelpful.",
    "The website had a great selection of products, but checkout was slow and kept crashing.",
    "My package was delivered three days early, and I loved the eco-friendly packaging!",

    # Healthcare
    "The doctor was very knowledgeable, but the wait time at the clinic was nearly two hours.",
    "My medication was prescribed incorrectly, causing unnecessary health issues.",
    "The hospital staff were compassionate and made me feel at ease during my surgery.",

    # Finance
    "The mobile banking app is easy to use, but customer service is impossible to reach.",
    "I was charged an unexpected fee, but after calling support, they refunded me immediately.",
    "My loan application process was smooth, and I received my funds within 24 hours!",

    # Transportation
    "My Uber driver was polite and played great music, but the car smelled like smoke.",
    "The train was delayed for an hour, and no announcements were made about the reason.",
    "Booking my flight was easy, but checking in at the airport was a nightmare with long lines and unhelpful staff.",

    # Hospitality
    "The hotel room was spacious and clean, but the breakfast options were very limited.",
    "I had an amazing stay! The staff went above and beyond to accommodate my requests.",
    "Our restaurant reservation was lost, and we had to wait an extra 45 minutes for a table.",

    # Retail
    "The clothing quality was excellent, but the size chart was misleading.",
    "The supermarket had great discounts, but the checkout lines were too long.",
    "I found an amazing deal on a laptop, and it was delivered within 24 hours!",

    # Technology
    "My laptop kept crashing after the latest update, and tech support couldn’t fix the issue.",
    "The new smartphone has a great camera, but the battery life is terrible.",
    "Setting up my smart home system was surprisingly easy, and the app is very user-friendly!",

    # Entertainment & Streaming
    "Netflix removed my favorite show, and now I’m reconsidering my subscription.",
    "I attended a live concert, and the sound quality was phenomenal!",
    "The new video game has amazing graphics, but the gameplay feels repetitive.",

    # Food & Beverage
    "My coffee order was completely wrong, and they refused to fix it.",
    "The restaurant had a fantastic atmosphere, and the food was worth every penny!",
    "The fast food service was quick, but the burger was cold when I received it.",

    # Customer Service
    "The support agent was rude and disconnected my call before resolving my issue.",
    "I had a billing problem, and the representative resolved it in under five minutes!",
    "The live chat feature is great, but the response time is way too slow.",
  ]

    results = []

    for text in feedback_texts:
      # print(f"\nFeedback: {text}")
      result = customer_emotion_analysis(text)
      results.append(json.loads(result))  # Convert JSON string to dictionary

# Save the results to a JSON file
    with open("feedback_analysis.json", "w", encoding="utf-8") as file:
        json.dump(results, file, indent=4, ensure_ascii=False)

    print("✅ Feedback analysis saved to 'feedback_analysis.json' successfully!")