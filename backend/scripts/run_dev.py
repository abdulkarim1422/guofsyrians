"""Development server runner with programmatic uvicorn."""
import uvicorn
import sys
import os

# Add parent directory to path so we can import app
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

def run_dev_server():
    print("Starting development server programmatically...")
    print("MongoDB should be running on localhost:27017")
    
    config = uvicorn.Config(
        "app.main:app",
        host="127.0.0.1", 
        port=8600,
        reload=False,  # Disable reload to avoid file watcher issues
        log_level="info",
        access_log=True
    )
    
    server = uvicorn.Server(config)
    server.run()

if __name__ == "__main__":
    run_dev_server()
