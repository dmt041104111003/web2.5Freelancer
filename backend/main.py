from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv, find_dotenv
from api.blockchain import router as blockchain_router
from api.ipfs import router as ipfs_router
from api.face import router as face_router

app = FastAPI(title="Web2.5 Freelancer API", version="1.0.0")

load_dotenv(find_dotenv('.env.local'), override=True)
load_dotenv(find_dotenv('.env'), override=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(blockchain_router, prefix="/api/blockchain", tags=["blockchain"])
app.include_router(ipfs_router, prefix="/api/ipfs", tags=["ipfs"])
app.include_router(face_router, prefix="/api/face", tags=["face"])

@app.get("/")
async def root():
    return {"message": "Web2.5 Freelancer API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
