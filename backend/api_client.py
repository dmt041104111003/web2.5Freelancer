import requests
import os
from typing import Optional, Any

class APIClient:
    def __init__(self, base_url: str = "http://localhost:8000/api"):
        self.base_url = base_url

    def register_did_on_chain(self):
        raise Exception('registerDidOnChain must be implemented with wallet integration on client-side')

    def register_profile_on_blockchain(self, verification_cid: str, profile_cid: str, cv_cid: str, avatar_cid: str):
        raise Exception('registerProfileOnBlockchain must be implemented with wallet integration on client-side')

    def update_profile_assets(self, new_profile_cid: str, new_cv_cid: str, new_avatar_cid: str):
        raise Exception('updateProfileAssets must be implemented with wallet integration on client-side')

    def check_profile_exists(self, user_address: str) -> bool:
        """checkProfileExists method từ TypeScript"""
        response = requests.get(
            f"{self.base_url}/blockchain",
            params={"action": "checkProfileExists", "userAddress": user_address}
        )
        data = response.json()
        return data["exists"]

    def get_profile_data(self, user_address: str):
        """getProfileData method từ TypeScript"""
        response = requests.get(
            f"{self.base_url}/blockchain",
            params={"action": "getProfileData", "userAddress": user_address}
        )
        data = response.json()
        return data

    def get_did_details(self, user_address: str):
        """getDidDetails method từ TypeScript"""
        response = requests.get(
            f"{self.base_url}/blockchain",
            params={"action": "getDidDetails", "userAddress": user_address}
        )
        data = response.json()
        return data

    def pin_json_to_ipfs(self, json_data: Any) -> str:
        """pinJsonToIPFS method từ TypeScript"""
        response = requests.post(
            f"{self.base_url}/ipfs",
            json={"action": "pinJson", "data": json_data}
        )
        data = response.json()
        return data["cid"]

    def pin_file_to_ipfs(self, file_data: Any) -> str:
        """pinFileToIPFS method từ TypeScript"""
        response = requests.post(
            f"{self.base_url}/ipfs",
            json={"action": "pinFile", "data": file_data}
        )
        data = response.json()
        return data["cid"]

    def get_from_ipfs(self, cid: str):
        """getFromIPFS method từ TypeScript"""
        response = requests.get(
            f"{self.base_url}/ipfs",
            params={"cid": cid}
        )
        data = response.json()
        return data["data"]

    def upload_id_card(self, file_path: str):
        """uploadIdCard method từ TypeScript"""
        with open(file_path, 'rb') as f:
            files = {'id_card': f}
            response = requests.post(
                f"{self.base_url}/face/upload_id_card",
                files=files
            )
        return response.json()

    def verify_webcam(self, file_path: str):
        """verifyWebcam method từ TypeScript"""
        with open(file_path, 'rb') as f:
            files = {'webcam': f}
            response = requests.post(
                f"{self.base_url}/face/verify_webcam",
                files=files
            )
        return response.json()


api_client = APIClient()
