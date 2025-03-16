from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer

# Define model name
model_name = "facebook/nllb-200-distilled-600M"

# Load the model and tokenizer
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

local_directory = "./Models/nllb-200-distilled-600M/"

# Save model and tokenizer to local directory
model.save_pretrained(local_directory)
tokenizer.save_pretrained(local_directory)

print(f"Model saved locally at: {local_directory}")
