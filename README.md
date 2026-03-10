# AI Code Converter

An intelligent web application that translates code between various programming languages using Google's Gemini 1.5 Flash model.

## Features

- **Multi-language Support**: Convert code between Python, JavaScript, Java, C++, C, C#, Go, Rust, PHP, and Ruby.
- **AI-Powered**: Uses Gemini 1.5 Flash for accurate and context-aware code translation.
- **Modern Editor**: Integrated Monaco Editor (the same engine that powers VS Code) for a premium coding experience with syntax highlighting.
- **Real-time Conversion**: Quick and responsive interface with built-in error handling and loading states.
- **Clean UI**: Premium, responsive design with a focus on usability.

## Project Structure

```text
converter/
├── backend/
│   ├── main.py          # FastAPI server and Gemini API integration
│   ├── .env              # Environment variables (API Key)
│   ├── requirements.txt  # Python dependencies
│   └── test_gemini.py   # Script to test API connectivity
└── frontend/
    ├── index.html       # Main UI structure
    ├── script.js        # Frontend logic and Monaco Editor setup
    └── styles.css       # Custom styling and transitions
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Google Gemini API Key (Get one for free at [Google AI Studio](https://aistudio.google.com/))

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend` directory (if it doesn't exist) and add your API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### Running the Application

1. Start the FastAPI server:
   ```bash
   uvicorn main:app
   ```
2. Open your browser and navigate to:
   ```text
   http://127.0.0.1:8000
   ```
   *The frontend is automatically served by FastAPI from the root URL.*

### Development

- **Backend**: Built with FastAPI. All API routes are under `/api/`.
- **Frontend**: A single-page application (SPA) using vanilla JavaScript, CSS, and the Monaco Editor.

## License

MIT
