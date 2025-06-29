from crud import member_crud
from models import member_model
from bson import ObjectId
from typing import Dict, Any, Optional
from fastapi import HTTPException

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