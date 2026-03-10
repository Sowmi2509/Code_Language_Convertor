import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

print(f"API Key found: {'Yes' if API_KEY else 'No'}")
if API_KEY:
    print(f"API Key prefix: {API_KEY[:8]}...")

try:
    client = genai.Client(api_key=API_KEY)
    response = client.models.generate_content(
        model='gemini-flash-latest',
        contents="Hello, say 'Test successful'",
    )
    print("Response response:", response.text)
except Exception as e:
    print(f"Error occurred: {type(e).__name__}: {str(e)}")
