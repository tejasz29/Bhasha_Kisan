import os
import json
import uvicorn
import traceback
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import firebase_admin
from firebase_admin import credentials, firestore

# 1. Load Environment Variables
load_dotenv()

# 2. Setup Gemini AI
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("❌ CRITICAL: GOOGLE_API_KEY not found!")
else:
    genai.configure(api_key=GOOGLE_API_KEY)
    print("✅ Gemini AI Configured")

# 3. Setup Firebase
db = None
try:
    if not firebase_admin._apps:
        firebase_creds_json = os.getenv("FIREBASE_CREDENTIALS")
        if firebase_creds_json:
            cred_dict = json.loads(firebase_creds_json)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            print("✅ Firebase Connected")
except Exception as e:
    print(f"⚠️ Firebase Error: {e}")

# 4. Initialize FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Routes

@app.get("/")
def home():
    return {"message": "Bhasha-Kisan Backend is Live 🟢"}

@app.post("/analyze")
async def analyze_crop(
    text: str = Form(None), 
    image: UploadFile = File(None),
    user_id: str = Form("guest")
):
    print("\n--- 🚀 REQUEST START ---")
    
    try:
        # Use the "Latest" alias (Free Tier + Reliable)
        # Use the Standard 1.5 Flash model (High Limit: 15 requests/min)
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt_parts = []
        
        # --- SYSTEM INSTRUCTION ( The "Brain" of Bhasha-Kisan ) ---
        # We tell the AI exactly who it is and how to behave.
        system_prompt = (
            "You are 'Bhasha-Kisan', an expert AI agricultural assistant for Indian farmers. "
            "Your answers should be simple, practical, and easy to understand. "
            "Ignore technical jargon unless necessary."
        )
        prompt_parts.append(system_prompt)

        # 1. Handle Text (Typed Questions or Voice)
        if text:
            print(f"📝 User Query: {text}")
            # This is the 'Native Language' Magic logic:
            language_instruction = (
                f"User Query: '{text}'\n\n"
                "INSTRUCTIONS:\n"
                "1. Detect the language of the query above (e.g., Hindi, Marathi, Tamil, Gujarati, English).\n"
                "2. Answer the query STRICTLY in that same language.\n"
                "3. If the user types in 'Hinglish' (Hindi with English letters), answer in Hindi using Devanagari script.\n"
                "4. If the user asks for a solution, give step-by-step advice."
            )
            prompt_parts.append(language_instruction)
            
        else:
            # 2. Handle Image Only (No Text Provided)
            # Fallback: Give dual language since we don't know what they speak.
            prompt_parts.append(
                "Analyze this crop image. Identify disease, pests, or nutrient deficiency. "
                "Provide simple home remedies and chemical solutions. "
                "IMPORTANT: Provide the response in TWO languages: English and Hindi (side-by-side)."
            )

        # 3. Handle Image Input
        if image:
            print(f"📸 Image: {image.filename}")
            content = await image.read()
            image_blob = {"mime_type": image.content_type, "data": content}
            prompt_parts.append(image_blob)

        if not prompt_parts:
            return {"answer": "Namaste! Please ask a question or upload a photo."}

        # 4. Generate Content
        print("📡 Sending to Gemini...")
        response = model.generate_content(prompt_parts)
        print("✅ Success!")
        
        answer_text = response.text
        
        # 5. Save to History
        if db:
            try:
                db.collection("users").document(user_id).collection("history").add({
                    "timestamp": firestore.SERVER_TIMESTAMP,
                    "transcript": text or "Image Upload",
                    "analysis": answer_text[:100] + "...", 
                    "response": {"answer": answer_text}
                })
            except:
                pass

        return {"answer": answer_text}

    except Exception as e:
        print(f"🔥 ERROR: {str(e)}")
        traceback.print_exc()
        return {"answer": f"Error: {str(e)}"}

@app.get("/history/{user_id}")
def get_history(user_id: str):
    if not db: return {"history": []}
    try:
        docs = db.collection("users").document(user_id).collection("history")\
                 .order_by("timestamp", direction=firestore.Query.DESCENDING).limit(10).stream()
        return {"history": [d.to_dict() for d in docs]}
    except:
        return {"history": []}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
