from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from bson import ObjectId
from config.database import init_db
from routers import all_routers
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="GuofSyrians backend",
    description="backend for managing Guof Syrians members and teams",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 

# Mount static files for member images
uploads_dir = "uploads"
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include all routers
app.include_router(all_routers.router, prefix="/api")

# Initialize the database connection
@app.on_event("startup")
async def on_startup():
    await init_db()


@app.get("/")
def read_root():
    return {"Hello": "World"}

