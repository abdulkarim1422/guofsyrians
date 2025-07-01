from crud import member_crud, user_crud
from models import member_model, user_model
from bson import ObjectId
from typing import Dict, Any, Optional
from fastapi import HTTPException
import random
from services import mail_service, auth_services

async def member_resume_form(user_id: str, form_data: Dict[str, Any]) -> member_model.Member:
    """
    Process resume form data and update member profile
    """
    try:
        # Check if member exists by user_id
        existing_member = await member_crud.get_member_by_user_id(user_id)
        
        if not existing_member:
            raise HTTPException(status_code=404, detail="Member not found")
        
        # Update member basic information
        existing_member.name = form_data.get("name", existing_member.name)
        existing_member.email = form_data.get("email", existing_member.email)
        existing_member.phone = form_data.get("telephone", existing_member.phone)
        existing_member.professional_title = form_data.get("occupation", existing_member.professional_title)
        existing_member.city = form_data.get("location", existing_member.city)
        existing_member.bio = form_data.get("aboutDescription", existing_member.bio)
        
        # Process skills
        technical_skills = form_data.get("technicalSkills", "")
        soft_skills = form_data.get("softSkills", "")
        
        all_skills = []
        if technical_skills:
            all_skills.extend([skill.strip() for skill in technical_skills.split(",") if skill.strip()])
        if soft_skills:
            all_skills.extend([skill.strip() for skill in soft_skills.split(",") if skill.strip()])
        
        existing_member.skills = all_skills
        
        # Process social media links
        social_media = {}
        if form_data.get("linkedinUrl"):
            social_media["linkedin"] = form_data["linkedinUrl"]
        if form_data.get("githubUrl"):
            social_media["github"] = form_data["githubUrl"]
        
        existing_member.social_media = social_media
        
        # Update the member
        updated_member = await member_crud.update_member(existing_member.id, existing_member)
        
        if not updated_member:
            raise HTTPException(status_code=500, detail="Failed to update member data")
            
        return updated_member
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing resume form: {str(e)}")

# function to create a new member user with resume form data
async def create_user_with_resume_form_and_send_welcome_email(mail: str, name: str) -> user_model.User:
    """
    Create a new user with the provided email and resume form data.
    """
    # Generate a random password
    plain_password = "".join(random.choices("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", k=8))
    
    user_to_insert = user_model.User(
        email=mail,
        password=auth_services.get_password_hash(plain_password),  # Hash the password
        name=name,
        role="member"  # Default role for new users
    )

    user = await user_crud.create_user(user_to_insert)
    # Send welcome email to the new user
    if user:
        send_welcome_email(user, plain_password)  # Pass the plain password for email
    else:
        raise HTTPException(status_code=500, detail="Failed to create user")
    return user

# function to send the new user's password to their email
def send_welcome_email(user: user_model.User, plain_password: str) -> None:
    """
    Send a welcome email to the new user with their password.
    """
    subject = "Welcome to GuofSyrians"
    body = f"""
    Hello {user.name},\n\n

    Your account has been created successfully.\n
    Your password is: {plain_password}\n\n

    please login to your account from the following link:\n
    https://app.guofsyrians.com/login\n\n

    Best regards,\n
    The GuofSyrians Team
    """

    mail_service.send_email(user.email, subject, body)