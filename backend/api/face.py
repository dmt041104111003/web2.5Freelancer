from fastapi import APIRouter, HTTPException, UploadFile, File
import requests
import os

router = APIRouter()

FACE_API_BASE_URL = os.getenv("NEXT_PUBLIC_FACE_API_BASE_URL", "http://localhost:5000")

@router.post("/upload_id_card")
async def upload_id_card(id_card: UploadFile = File(...)):
    """uploadIdCard function từ TypeScript api-client.ts"""
    try:
        file_content = await id_card.read()
        files = {
            'id_card': (id_card.filename, file_content, id_card.content_type)
        }

        response = requests.post(
            f"{FACE_API_BASE_URL}/upload_id_card",
            files=files
        )
        
        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail="Face API error")
        
        return response.json()
        
    except Exception as e:
        print(f"Face API upload error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/verify_webcam")
async def verify_webcam(webcam: UploadFile = File(...)):
    """verifyWebcam function từ TypeScript api-client.ts"""
    try:

        file_content = await webcam.read()
        files = {
            'webcam': (webcam.filename, file_content, webcam.content_type)
        }

        response = requests.post(
            f"{FACE_API_BASE_URL}/verify_webcam",
            files=files
        )
        
        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail="Face API error")
        
        return response.json()
        
    except Exception as e:
        print(f"Face API verification error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
