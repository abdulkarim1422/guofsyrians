"""Minimal FastAPI test to isolate shutdown issue."""
from fastapi import FastAPI
import uvicorn
import asyncio

app = FastAPI(title="Minimal Test")

@app.get("/")
async def root():
    return {"status": "alive", "message": "Minimal test server"}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    print("Starting minimal test server on port 9000...")
    uvicorn.run(app, host="127.0.0.1", port=9000, log_level="info")
