from fastapi import APIRouter, HTTPException
from services.mail_service import send_email

router = APIRouter()

@router.post("/send-mail")
async def send_mail(to: str, subject: str, message: str):
    """
    Endpoint to send an email.
    """
    if not to or not subject or not message:
        raise HTTPException(status_code=400, detail="To, subject, and message are required fields.")
    
    success = send_email(to, subject, message)
    
    if success:
        return {"message": "Email sent successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send email")