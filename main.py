import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI()

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConvertRequest(BaseModel):
    source_code: str
    target_language: str

@app.post("/api/convert")
async def convert_code(request: ConvertRequest):
    if not API_KEY or API_KEY == "your_api_key_here":
        raise HTTPException(
            status_code=500, 
            detail="Gemini API Key not configured. Please set your free API key in backend/.env"
        )

    prompt = f"""
    You are an expert programmer. Convert the following code into {request.target_language}.
    Provide ONLY the converted code, with no explanations, markdown formatting, or extra text.
    Do NOT wrap the output in ```code block tags```. Just the raw code.
    
    Code to convert:
    {request.source_code}
    """

    try:
        client = genai.Client(api_key=API_KEY)
        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt,
        )
        return {"converted_code": response.text.strip()}
    except Exception as e:
        # Check if it is a quota or API error
        error_msg = str(e)
        status_code = 500
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            status_code = 429
            detail = "Gemini API Quota Exceeded. Please try again in a minute or check your API key limits."
        elif "401" in error_msg or "403" in error_msg:
            status_code = 403
            detail = "Invalid or unauthorized API key. Please check your GEMINI_API_KEY in .env"
        else:
            detail = error_msg
        
        raise HTTPException(status_code=status_code, detail=detail)

# Mount frontend at root - MUST be after all API routes
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
