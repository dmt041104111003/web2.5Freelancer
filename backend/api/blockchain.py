from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
import requests
import os
from typing import Optional
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()

def env() -> dict:
    return {
        "CONTRACT_ADDRESS": os.getenv("NEXT_PUBLIC_CONTRACT_ADDRESS"),
        "PROFILE_MODULE": os.getenv("NEXT_PUBLIC_PROFILE_MODULE"),
        "DID_MODULE": os.getenv("NEXT_PUBLIC_DID_MODULE"),
        "APTOS_REST_URL": os.getenv("NEXT_PUBLIC_APTOS_REST_URL"),
    }

class BlockchainRequest(BaseModel):
    action: str
    userAddress: Optional[str] = None
    verificationCid: Optional[str] = None
    profileCid: Optional[str] = None
    cvCid: Optional[str] = None
    avatarCid: Optional[str] = None

@router.get("/")
async def get_blockchain_data(
    action: str = Query(...),
    userAddress: str = Query(...)
):
    """GET endpoint - giống như TypeScript route.ts"""
    try:
        e = env()
        if not all([e["CONTRACT_ADDRESS"], e["PROFILE_MODULE"], e["APTOS_REST_URL"], e["DID_MODULE"]]):
            raise HTTPException(status_code=500, detail="Missing Aptos env variables")
        if not action or not userAddress:
            return {"error": "Missing required parameters"}, 400

        if action == "checkProfileExists":
            exists = await check_profile_exists(e, userAddress)
            return {"exists": exists}
        
        elif action == "getProfileData":
            profile_data = await get_profile_data(e, userAddress)
            return {"profileData": profile_data}
        
        elif action == "getDidDetails":
            did_details = await get_did_details(e, userAddress)
            return {"didDetails": did_details}
        
        else:
            return {"error": "Invalid action"}, 400
            
    except Exception as e:
        print(f"Blockchain API error: {e}")
        return {"error": "Internal server error"}, 500

@router.post("/")
async def post_blockchain_data(request: BlockchainRequest):
    """POST endpoint - giống như TypeScript route.ts"""
    try:
        if request.action == "registerDidOnChain":
            return {
                "error": "registerDidOnChain must be called from client-side with wallet",
                "txHash": None
            }, 400
        
        elif request.action == "registerProfileOnBlockchain":
            return {
                "error": "registerProfileOnBlockchain must be called from client-side with wallet", 
                "txHash": None
            }, 400
        
        elif request.action == "updateProfileAssets":
            return {
                "error": "updateProfileAssets must be called from client-side with wallet",
                "txHash": None
            }, 400
        
        else:
            return {"error": "Invalid action"}, 400
            
    except Exception as e:
        print(f"Blockchain API error: {e}")
        return {"error": "Internal server error"}, 500

async def check_profile_exists(e: dict, user_address: str) -> bool:
    """checkProfileExists function từ TypeScript"""
    try:
        response = requests.post(f"{e['APTOS_REST_URL']}/v1/view", json={
            "function": f"{e['CONTRACT_ADDRESS']}::{e['PROFILE_MODULE']}::has_profile",
            "type_arguments": [],
            "arguments": [user_address]
        })
        
        if not response.ok:
            return False
            
        data = response.json()
        return data[0] if data else False
        
    except Exception as e:
        print(f"Error checking profile existence: {e}")
        return False

async def get_profile_data(e: dict, user_address: str):
    """getProfileData function từ TypeScript"""
    try:
        response = requests.post(f"{e['APTOS_REST_URL']}/v1/view", json={
            "function": f"{e['CONTRACT_ADDRESS']}::{e['PROFILE_MODULE']}::get_profile_by_address",
            "type_arguments": [],
            "arguments": [user_address]
        })
        
        if not response.ok:
            return None
            
        data = response.json()
        raw = data[0] if data else None
        
        if not raw:
            return None
            
        return {
            "did_hash": raw.get("did_hash", ""),
            "verification_cid": raw.get("verification_cid", ""),
            "profile_cid": raw.get("profile_cid", ""),
            "cv_cid": raw.get("cv_cid", ""),
            "avatar_cid": raw.get("avatar_cid", ""),
            "trust_score": int(raw.get("trust_score", 0)),
            "created_at": int(raw.get("created_at", 0))
        }
        
    except Exception as e:
        print(f"Error getting profile data: {e}")
        return None

async def get_did_details(e: dict, user_address: str):
    """Resolve DID status directly from DID module (does not require profile)."""
    try:
        has_res = requests.post(f"{e['APTOS_REST_URL']}/v1/view", json={
            "function": f"{e['CONTRACT_ADDRESS']}::{e['DID_MODULE']}::has_verified_did",
            "type_arguments": [],
            "arguments": [user_address]
        })
        has_verified = False
        if has_res.ok:
            arr = has_res.json()
            has_verified = bool(arr and arr[0])

        # Try to get did_hash from address
        did_hash = "0x"
        hash_res = requests.post(f"{e['APTOS_REST_URL']}/v1/view", json={
            "function": f"{e['CONTRACT_ADDRESS']}::{e['DID_MODULE']}::get_did_hash",
            "type_arguments": [],
            "arguments": [user_address]
        })
        if hash_res.ok:
            arr = hash_res.json()
            did_hash = arr[0] if arr else "0x"

        controller = ""
        if did_hash and did_hash != "0x":
            ctrl_res = requests.post(f"{e['APTOS_REST_URL']}/v1/view", json={
                "function": f"{e['CONTRACT_ADDRESS']}::{e['DID_MODULE']}::resolve_controller_by_hash",
                "type_arguments": [],
                "arguments": [did_hash]
            })
            if ctrl_res.ok:
                arr = ctrl_res.json()
                controller = arr[0] if arr else ""
                has_verified = has_verified or (controller and controller.lower() == user_address.lower())

        return {"hasVerified": bool(has_verified), "didHash": did_hash or "0x", "controller": controller}
    except Exception as ex:
        print(f"Error getting DID details: {ex}")
        return {"hasVerified": False, "didHash": "0x", "controller": ""}
