from app.models import member_model
from bson import ObjectId

# Member CRUD operations
async def create_member(member) -> member_model.Member:
    await member.insert()
    return member

# TODO - remove this function after integrating with loggedin users
async def create_resume_member(member) -> member_model.Member:
    """Create a member from resume form without requiring user_id or team_id"""
    member.user_id = None
    member.team_id = None
    await member.insert()
    return member

async def get_member_by_member_id(member_id: ObjectId) -> member_model.Member:
    return await member_model.Member.get(member_id)

async def get_member_by_id(member_id: str) -> member_model.Member:
    """Get member by string ID - converts to ObjectId"""
    try:
        return await member_model.Member.get(ObjectId(member_id))
    except Exception:
        return None

async def update_member(member_id: ObjectId, member: member_model.Member) -> member_model.Member:
    existing = await member_model.Member.get(member_id)
    if not existing:
        return None
    member.id = existing.id
    return await member.replace()

async def update_member_by_string_id(member_id: str, member: member_model.Member) -> member_model.Member:
    """Update member by string ID - converts to ObjectId"""
    try:
        return await update_member(ObjectId(member_id), member)
    except Exception:
        return None

async def delete_member(member_id: ObjectId) -> member_model.Member:
    member = await member_model.Member.get(member_id)
    if member:
        await member.delete()
        return member
    return None

async def get_all_members_from_all_teams() -> list:
    return await member_model.Member.find({}).to_list()

async def get_all_members_from_one_team(team_id: ObjectId) -> list:
    return await member_model.Member.find({"team_id": team_id}).to_list()

async def get_member_by_user_id(user_id: str) -> member_model.Member:
    return await member_model.Member.find_one({"user_id": user_id})

async def get_member_by_email(email: str) -> member_model.Member:
    return await member_model.Member.find_one({"email": email})

async def get_member_by_phone(phone: str) -> member_model.Member:
    return await member_model.Member.find_one({"phone": phone})

async def get_member_by_membership_number(membership_number: str) -> member_model.Member:
    return await member_model.Member.find_one({"membership_number": membership_number})

# MemberWorkExperience CRUD operations
async def create_member_work_experience(work_experience: member_model.MemberWorkExperience) -> member_model.MemberWorkExperience:
    await work_experience.insert()
    return work_experience

async def get_member_education_by_member_id(member_id: str) -> member_model.MemberEducation:
    return await member_model.MemberEducation.find_one({"member_id": member_id})

async def update_member_work_experience(work_experience_id: ObjectId, work_experience: member_model.MemberWorkExperience) -> member_model.MemberWorkExperience:
    existing = await member_model.MemberWorkExperience.get(work_experience_id)
    if not existing:
        return None
    work_experience.id = existing.id
    return await work_experience.replace()

async def delete_member_work_experience(work_experience_id: ObjectId) -> member_model.MemberWorkExperience:
    work_experience = await member_model.MemberWorkExperience.get(work_experience_id)
    if work_experience:
        await work_experience.delete()
        return work_experience
    return None

async def get_all_work_experiences_by_member_id(member_id: ObjectId) -> list:
    return await member_model.MemberWorkExperience.find({"member_id": str(member_id)}).to_list()

# MemberProject CRUD operations
async def create_member_project(project: member_model.MemberProject) -> member_model.MemberProject:
    await project.insert()
    return project

async def get_member_project_by_id(project_id: ObjectId) -> member_model.MemberProject:
    return await member_model.MemberProject.get(project_id)

async def update_member_project(project_id: ObjectId, project: member_model.MemberProject) -> member_model.MemberProject:
    existing = await member_model.MemberProject.get(project_id)
    if not existing:
        return None
    project.id = existing.id
    return await project.replace()

async def delete_member_project(project_id: ObjectId) -> member_model.MemberProject:
    project = await member_model.MemberProject.get(project_id)
    if project:
        await project.delete()
        return project
    return None

async def get_all_projects_by_member_id(member_id: ObjectId) -> list:
    return await member_model.MemberProject.find({"member_id": str(member_id)}).to_list()

# MemberEducation CRUD operations
async def create_member_education(education: member_model.MemberEducation) -> member_model.MemberEducation:
    await education.insert()
    return education

async def get_member_education_by_id(education_id: ObjectId) -> member_model.MemberEducation:
    return await member_model.MemberEducation.get(education_id)

async def update_member_education(education_id: ObjectId, education: member_model.MemberEducation) -> member_model.MemberEducation:
    existing = await member_model.MemberEducation.get(education_id)
    if not existing:
        return None
    education.id = existing.id
    return await education.replace()

async def delete_member_education(education_id: ObjectId) -> member_model.MemberEducation:
    education = await member_model.MemberEducation.get(education_id)
    if education:
        await education.delete()
        return education
    return None

async def get_all_educations_by_member_id(member_id: ObjectId) -> list:
    return await member_model.MemberEducation.find({"member_id": str(member_id)}).to_list()

# Bulk delete operations for related documents
async def delete_all_work_experiences_by_member_id(member_id: str) -> int:
    """Delete all work experiences for a member and return count of deleted documents"""
    result = await member_model.MemberWorkExperience.find({"member_id": member_id}).delete()
    return result.deleted_count if result else 0

async def delete_all_educations_by_member_id(member_id: str) -> int:
    """Delete all education entries for a member and return count of deleted documents"""
    result = await member_model.MemberEducation.find({"member_id": member_id}).delete()
    return result.deleted_count if result else 0

async def delete_all_projects_by_member_id(member_id: str) -> int:
    """Delete all projects for a member and return count of deleted documents"""
    result = await member_model.MemberProject.find({"member_id": member_id}).delete()
    return result.deleted_count if result else 0
