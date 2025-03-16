from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer

# Define the local directory
local_directory = "./Models/nllb-200-distilled-600M/"

# Load the model and tokenizer from the local directory
model = AutoModelForSeq2SeqLM.from_pretrained(local_directory)
tokenizer = AutoTokenizer.from_pretrained(local_directory)

# Create the pipeline using the locally saved model
translator = pipeline("translation", model=model, tokenizer=tokenizer, src_lang="eng_Latn",tgt_lang="tam_Taml",max_length=4000)

output = translator("Hey this is Arulkevin")
print(output)
