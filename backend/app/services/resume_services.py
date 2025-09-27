from app.crud import member_crud, user_crud
from app.models import member_model, user_model
from bson import ObjectId
from typing import Dict, Any, Optional
from fastapi import HTTPException
import random
from app.services import mail_service, auth_services

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
        technical_skills = form_data.get("storedSkills", "")
        soft_skills = form_data.get("storedInterests", "")
        
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
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
        <style>
            body {{
                font-family: 'Tajawal', 'Arial', sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
                direction: rtl;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(135deg, #d6b549 0%, #b8941a 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }}
            .content {{
                padding: 30px;
                line-height: 1.6;
                color: #333;
            }}
            .credentials {{
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 5px;
                padding: 20px;
                margin: 20px 0;
            }}
            .field {{
                margin: 15px 0;
                padding: 10px;
                background-color: #e9ecef;
                border-radius: 5px;
                border: 1px solid #ced4da;
            }}
            .field label {{
                font-weight: bold;
                color: #495057;
                display: block;
                margin-bottom: 5px;
            }}
            .field input {{
                width: 100%;
                padding: 8px;
                border: 1px solid #ced4da;
                border-radius: 3px;
                font-size: 14px;
                background-color: #fff;
            }}
            .login-button {{
                display: inline-block;
                background: linear-gradient(135deg, #d6b549 0%, #b8941a 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                text-align: center;
            }}
            .footer {{
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #dee2e6;
                color: #6c757d;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>مرحباً بك في منصّة إتقان</h1>
                <p>تم إنشاء حسابك بنجاح</p>
            </div>
            <div class="content">
                <p>مرحباً {user.name}،</p>
                <p>يسعدنا انضمامك إلى منصة إتقان . هذه المنصة صُمِّمت خصيصًا لك لتسهيل وصولك إلى الفرص التدريبية والوظيفية المناسبة.</p>
                
                <div class="credentials">
                    <h3>معلومات تسجيل الدخول:</h3>
                    <div class="field">
                        <label>البريد الإلكتروني:</label>
                        <input type="text" value="{user.email}" readonly onclick="this.select()">
                    </div>
                    <div class="field">
                        <label>كلمة المرور:</label>
                        <input type="text" value="{plain_password}" readonly onclick="this.select()">
                    </div>
                    <p style="font-size: 12px; color: #6c757d;">انقر على الحقول أعلاه لتحديد النص ونسخه</p>
                </div>
                
                <div style="text-align: center;">
                    <a href="https://app.guofsyrians.org/login" class="login-button">تسجيل الدخول الآن</a>
                </div>
                
                <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">
                    لأسباب أمنية، ننصحك بتغيير كلمة المرور بعد تسجيل الدخول الأول.
                </p>
            </div>
            <div class="footer">
                <p>مع أطيب التحيات،<br>فريق المكتب البرمجي التابع للاتّحاد العام لطلبة سوريا - تركيا </p>
            </div>
        </div>
    </body>
    </html>
    """

    mail_service.send_email(user.email, subject, body)
    print("backend -- Welcome email sent to:", user.email)