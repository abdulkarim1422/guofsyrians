import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Access environment variables

# DB
SMTP_PORT = os.getenv("SMTP_PORT")
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_HOST = os.getenv("SMTP_HOST")

