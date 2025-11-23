from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GEMINI_API_KEY")
# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client()
prompt = (
        "Give me 3 random city names from around the world. "
        "Return only the city names separated by commas, no extra text."
    )
response = client.models.generate_content(
    model="gemini-2.5-flash",  # or "models/gemini-2.5-flash"
    contents=prompt
)

print(response.text)
