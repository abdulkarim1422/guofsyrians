"""Robust backend server with proper lifespan management."""
import asyncio
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
import signal
import sys
import os

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    print("🚀 Starting application...")
    
    # Import and initialize database
    from app.config.database import init_db, db
    await init_db()
    
    # Create indexes
    try:
        await db["applications"].create_index([("job_id", 1), ("user_id", 1)], unique=True)
        print("✅ Database indexes created")
    except Exception as e:
        print(f"⚠️  Index creation warning: {e}")
    
    print("✅ Application startup complete")
    
    yield
    
    print("🛑 Shutting down application...")

def create_app():
    """Create FastAPI application with proper configuration."""
    
    # Import after path setup
    from app.main import app as main_app
    
    # Override the lifespan if needed
    if not hasattr(main_app, 'router') or not main_app.router.lifespan_context:
        main_app.router.lifespan_context = lifespan
    
    return main_app

def signal_handler(signum, frame):
    """Handle shutdown signals gracefully."""
    print(f"\n📡 Received signal {signum}, shutting down gracefully...")
    sys.exit(0)

if __name__ == "__main__":
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    print("🔧 Creating FastAPI application...")
    app = create_app()
    
    # Configuration
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8222"))
    
    print(f"🌐 Starting server on http://{host}:{port}")
    print("📋 Available endpoints:")
    print("   • Health: /health")
    print("   • Legacy API: /api/*") 
    print("   • V2 API: /api/v2/*")
    print("   • Admin: Create user via /api/auth/register")
    print("\n🔄 Press Ctrl+C to stop")
    
    try:
        # Use uvicorn.run with explicit app reference
        uvicorn.run(
            app,
            host=host,
            port=port,
            log_level="info",
            access_log=True,
            reload=False  # Disable reload to avoid file watcher issues
        )
    except KeyboardInterrupt:
        print("\n✋ Received interrupt signal")
    except Exception as e:
        print(f"❌ Server error: {e}")
    finally:
        print("🏁 Server stopped")
