from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form, Request
import json
from pydantic import BaseModel
import requests
import os
from typing import Any

router = APIRouter()
PINATA_JWT = os.getenv("PINATA_JWT")
PINATA_GATEWAY = os.getenv("NEXT_PUBLIC_IPFS_GATEWAY", "https://gateway.pinata.cloud/ipfs")

class IPFSRequest(BaseModel):
    action: str
    data: Any = None

@router.post("/")
async def post_ipfs_data(request: IPFSRequest):
    """POST endpoint - giống như TypeScript route.ts"""
    try:
        if request.action == "pinJson":
            cid = await pin_json_to_ipfs(request.data)
            return {"cid": cid}
        
        elif request.action == "pinFile":
            cid = await pin_file_to_ipfs(request.data)
            return {"cid": cid}
        
        else:
            return {"error": "Invalid action"}, 400
            
    except Exception as e:
        print(f"IPFS API error: {e}")
        return {"error": "Internal server error"}, 500

@router.get("/")
async def get_ipfs_data(cid: str = Query(...)):
    """GET endpoint - giống như TypeScript route.ts"""
    try:
        if not cid:
            return {"error": "Missing CID parameter"}, 400
        
        data = await get_from_ipfs(cid)
        return {"data": data}
        
    except Exception as e:
        print(f"IPFS GET error: {e}")
        return {"error": "Internal server error"}, 500

@router.post("/upload")
async def upload_ipfs_file(
    request: Request,
    file: UploadFile | None = File(None),
    name: str | None = Form(None),
):
    """Multipart upload to Pinata (pinFileToIPFS)."""
    try:
        files = None
        if file is not None:
            file_bytes = await file.read()
            files = {
                "file": (file.filename, file_bytes, file.content_type or "application/octet-stream"),
            }
        else:
            form = await request.form()
            for key, value in form.multi_items():
                if hasattr(value, 'filename'):
                    up: UploadFile = value 
                    data = await up.read()
                    files = {
                        "file": (up.filename, data, up.content_type or "application/octet-stream"),
                    }
                    break
            if files is None:
                raise HTTPException(status_code=422, detail="Missing file field")

        data = {}
        if name:
            data["pinataMetadata"] = json.dumps({"name": name})

        response = requests.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            headers={
                "Authorization": f"Bearer {PINATA_JWT}",
            },
            files=files,
            data=data,
        )

        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail=f"Pinata error: {response.text}")

        result = response.json()
        return {"cid": result.get("IpfsHash")}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading file to IPFS: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

async def pin_json_to_ipfs(json_data: Any) -> str:
    """pinJsonToIPFS function từ TypeScript"""
    try:
        response = requests.post(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {PINATA_JWT}",
            },
            json={
                "pinataContent": json_data,
                "pinataMetadata": {
                    "name": f"verification-{int(__import__('time').time())}.json",
                },
                "pinataOptions": {
                    "cidVersion": 1,
                },
            }
        )
        
        if not response.ok:
            raise Exception(f"Pinata API error: {response.status_text}")
        
        result = response.json()
        return result["IpfsHash"]
        
    except Exception as e:
        print(f"Error pinning JSON to IPFS: {e}")
        raise e

async def pin_file_to_ipfs(file_data: Any) -> str:
    """pinFileToIPFS function từ TypeScript"""
    try:


        files = file_data
        if isinstance(file_data, dict) and 'file' in file_data:
            files = file_data
        else:
            raise Exception("Invalid file data; expected multipart field 'file'")

        response = requests.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            headers={
                "Authorization": f"Bearer {PINATA_JWT}",
            },
            files=files
        )
        
        if not response.ok:
            raise Exception(f"Pinata API error: {response.status_text}")
        
        result = response.json()
        return result["IpfsHash"]
        
    except Exception as e:
        print(f"Error pinning file to IPFS: {e}")
        raise e

async def get_from_ipfs(cid: str) -> Any:
    """Fetch from IPFS; try JSON first, then text fallback."""
    try:
        response = requests.get(f"{PINATA_GATEWAY}/{cid}", headers={"Accept": "application/json,text/plain,*/*"})
        if not response.ok:
            raise Exception(f"IPFS Gateway error: {response.status_code} {response.text}")


        content_type = response.headers.get('Content-Type', '')
        if 'application/json' in content_type:
            return response.json()


        try:
            return response.json()
        except Exception:
            text = response.text
            try:
                import json as _json
                return _json.loads(text)
            except Exception:
                return text
    except Exception as e:
        print(f"Error getting data from IPFS: {e}")
        raise e
