import firebase_admin
from firebase_admin import credentials, firestore, storage
import logging
import os
import json

logger = logging.getLogger(__name__)

class FirebaseService:
    def __init__(self):           # KJ
        self.db = None
        self.bucket = None
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        try:
            if not firebase_admin._apps:
                # 1. Local Development
                if os.path.exists('serviceAccountKey.json'):
                    cred = credentials.Certificate('serviceAccountKey.json')
                    firebase_admin.initialize_app(cred, {
                        'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET')
                    })
                    logger.info("Firebase initialized from local file")
                
                # 2. Render Deployment (Env Variable)
                elif os.getenv('FIREBASE_CREDENTIALS'):
                    creds_dict = json.loads(os.getenv('FIREBASE_CREDENTIALS'))
                    cred = credentials.Certificate(creds_dict)
                    firebase_admin.initialize_app(cred, {
                        'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET')
                    })
                    logger.info("Firebase initialized from Environment Variable")
                
                # 3. Default (Cloud Run / Auto-discovery)
                else:
                    firebase_admin.initialize_app()
                    logger.info("Firebase initialized from Default Credentials")
            
            self.db = firestore.client()
            self.bucket = storage.bucket()
            
        except Exception as e:
            logger.error(f"Firebase initialization error: {str(e)}")
            self.db = None

    async def create_user_profile(self, user_id, profile_data):
        if not self.db: return {}
        try:
            user_ref = self.db.collection('users').document(user_id)
            user_ref.set(profile_data, merge=True)
            return profile_data
        except Exception as e:
            logger.error(f"Error creating profile: {e}")
            return {}

    async def get_user_history(self, user_id, limit=20):
        if not self.db: return []
        try:
            docs = self.db.collection('voice_queries').where('user_id', '==', user_id).limit(limit).stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            logger.error(f"Error getting history: {e}")
            return []

    async def store_crop_analysis(self, user_id, analysis, image_url, audio_url):
        if not self.db: return "db_error"
        try:
            doc_ref = self.db.collection('crop_analyses').document()
            data = {
                "user_id": user_id,
                "analysis": analysis,
                "image_url": image_url,
                "audio_url": audio_url,
                "timestamp": firestore.SERVER_TIMESTAMP
            }
            doc_ref.set(data)
            return doc_ref.id
        except Exception as e:
            logger.error(f"Error storing analysis: {e}")
            return None

    async def store_voice_query(self, user_id, transcript, language, confidence):
        if not self.db: return "db_error"
        try:
            doc_ref = self.db.collection('voice_queries').document()
            data = {
                "user_id": user_id,
                "transcript": transcript,
                "language": language,
                "confidence": confidence,
                "timestamp": firestore.SERVER_TIMESTAMP
            }
            doc_ref.set(data)
            return doc_ref.id
        except Exception as e:
            logger.error(f"Error storing voice query: {e}")
            return None

    def is_healthy(self):
        return self.db is not None
