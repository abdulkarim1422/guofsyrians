from fastapi import FastAPI, HTTPException
from bson import ObjectId
from config.database import init_db
from routers import all_routers

app = FastAPI()

app.include_router(all_routers.router, prefix="/api")

# Initialize the database connection
@app.on_event("startup")
async def on_startup():
    await init_db()


@app.get("/")
def read_root():
    return {"Hello": "World"}

