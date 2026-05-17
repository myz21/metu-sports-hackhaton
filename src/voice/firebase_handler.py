import firebase_admin
from firebase_admin import credentials, firestore, storage
import os

class FirebaseHandler:
    def __init__(self, project_id, storage_bucket=None):
        self.project_id = project_id
        self.bucket_name = storage_bucket or f"{project_id}.firebasestorage.app" # Updated for new firebase storage format
        
        # Initialize Firebase Admin if not already initialized
        if not firebase_admin._apps:
            # Note: In a real environment, you'd use a service account JSON.
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred, {
                'projectId': project_id,
                'storageBucket': self.bucket_name
            })
            
        self.db = firestore.client()
        self.bucket = storage.bucket()

    def upload_audio(self, local_path, remote_path):
        """Uploads a local audio file to Firebase Storage."""
        print(f"Uploading {local_path} to gs://{self.bucket_name}/{remote_path}")
        blob = self.bucket.blob(remote_path)
        blob.upload_from_filename(local_path)
        # Make public (optional)
        blob.make_public()
        return blob.public_url

    def save_coaching_plan(self, session_id, cues, audio_url):
        """Saves the coaching session data to Firestore."""
        doc_ref = self.db.collection('sessions').document(session_id)
        doc_ref.set({
            'cues': cues,
            'audio_url': audio_url,
            'timestamp': firestore.SERVER_TIMESTAMP,
            'status': 'completed'
        })
        print(f"Session {session_id} saved to Firestore.")
