import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import requests
from app.config import env_variables

def send_email(to, subject, message):
    SMTP_PORT = env_variables.SMTP_PORT
    SMTP_USER = env_variables.SMTP_USER
    SMTP_PASS = env_variables.SMTP_PASS
    SMTP_HOST = env_variables.SMTP_HOST
    print(f"Using SMTP server: {SMTP_HOST}:{SMTP_PORT}")
    print(f"Using SMTP user: {SMTP_USER}")
    print(str(SMTP_PASS)[:len(str(SMTP_PASS))//2])

    # Check if SMTP configuration is available
    if not all([SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS]):
        print("SMTP configuration is not set. Please check your environment variables.")
        return False

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USER
        msg['To'] = to
        msg['Subject'] = subject
        msg.attach(MIMEText(message, 'plain'))

        server = smtplib.SMTP(host=SMTP_HOST, port=int(SMTP_PORT))
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
        server.quit()

        print(f"Email sent successfully to {to}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False