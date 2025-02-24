from transformers import TFAutoModelForSequenceClassification, AutoTokenizer

model_name = "arpanghoshal/EmoRoBERTa"

# Download and save the model
model = TFAutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Save it locally
model.save_pretrained("./Models/EmoRoBERTa/")
tokenizer.save_pretrained("./Models/EmoRoBERTa/")
