# app/main.py
from fastapi import FastAPI, Request, HTTPException
import asyncio
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import logging
import contextlib
import os

from app.config.database import init_db, db
from app.routers import all_routers
from app.api.v2 import api_v2_router
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core import errors as core_errors

# ── logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("guof-backend")

# ── app ────────────────────────────────────────────────────────────────────────
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app_: FastAPI):
    # startup
    await init_db()
    try:
        await db["applications"].create_index([("job_id", 1), ("user_id", 1)], unique=True)
    except Exception as e:
        logger.warning(f"create_index(applications) warning: {e}")
    yield
    # shutdown (nothing custom now)


app = FastAPI(
    title="GuofSyrians backend",
    description="backend for managing Guof Syrians members and teams",
    version="1.0.0",
    lifespan=lifespan,
)

# ── Error handlers (applies also to v2) ───────────────────────────────────────
app.add_exception_handler(StarletteHTTPException, core_errors.http_exception_handler)
app.add_exception_handler(RequestValidationError, core_errors.validation_exception_handler)
app.add_exception_handler(Exception, core_errors.unhandled_exception_handler)

load_dotenv()

# ── CORS ───────────────────────────────────────────────────────────────────────
# ملاحظة مهمة:
# لا يمكن استخدام allow_origins=["*"] مع allow_credentials=True في Starlette/FastAPI.
# هذا سيمنع إضافة Access-Control-Allow-Origin ويؤدي للخطأ الذي رأيته.
DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",     # Vite preview
    "http://127.0.0.1:4173",
    "http://localhost:5174",     # Additional Vite ports
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://127.0.0.1:5177",
    # أضف IP جهازك على الشبكة إن احتجت (مثال):
    # "http://192.168.1.111:5173",
]

env_origins = os.getenv("CORS_ALLOW_ORIGINS", "")
origins = [o.strip() for o in env_origins.split(",") if o.strip()] or DEFAULT_ORIGINS

# إن كانت النجمة موجودة ومع ذلك نستخدم credentials، استبدلها بالقائمة الافتراضية
if "*" in origins:
    origins = DEFAULT_ORIGINS

ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "true").lower() == "true"

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,               # origins محددة (ليست *)
    allow_credentials=ALLOW_CREDENTIALS, # True لو تستخدم كوكيز جلسة. Bearer token لا يحتاجها.
    allow_methods=["*"],                 # GET, POST, PATCH, DELETE, OPTIONS...
    allow_headers=["*"],                 # يتضمن Authorization و Content-Type
    expose_headers=["*"],
)

# ── Request logging (debug) ───────────────────────────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    try:
        response = await call_next(request)
    except Exception as e:
        logger.exception("Unhandled exception while processing request")
        return JSONResponse(status_code=500, content={"detail": str(e)})
    logger.info(f"Response: {response.status_code}")
    return response

# ── Static uploads ────────────────────────────────────────────────────────────
uploads_dir = "uploads"
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# ── Routers (legacy + v2) ─────────────────────────────────────────────────────
app.include_router(all_routers.router, prefix="/api")            # legacy
app.include_router(api_v2_router, prefix="/api/v2")               # new versioned

# ── Startup ───────────────────────────────────────────────────────────────────
# (legacy on_event startup removed in favor of lifespan)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "GuofSyrians API is running",
        "cors_origins": origins,
        "allow_credentials": ALLOW_CREDENTIALS,
    }
