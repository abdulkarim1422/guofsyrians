#!/usr/bin/env python3
"""
Database Migration Script for Enhanced Resume Fields

This script migrates existing resume data to include new fields:
- Work Experience: Split description into responsibilities and achievements
- Projects: Add project_type, tools, responsibilities, outcomes fields  
- Education: Add gpa and rank fields

Run this script after deploying the new model updates.
"""

import asyncio
import sys
import os
from datetime import datetime, timezone

# Add the backend directory to Python path to import modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.models.member_model import MemberWorkExperience, MemberProject, MemberEducation
from app.config.database import init_db

async def migrate_work_experience():
    """Migrate work experience records to split description into responsibilities and achievements"""
    print("🔄 Migrating work experience records...")
    
    # Find all work experience records that have description but no responsibilities
    work_experiences = await MemberWorkExperience.find(
        {"description": {"$exists": True, "$ne": None}, "responsibilities": {"$exists": False}}
    ).to_list()
    
    migrated_count = 0
    for work_exp in work_experiences:
        if work_exp.description:
            # For migration, put the entire description in responsibilities
            # Users can edit these later to separate achievements
            work_exp.responsibilities = work_exp.description
            work_exp.achievements = None  # Leave achievements empty for user to fill
            await work_exp.save()
            migrated_count += 1
    
    print(f"✅ Migrated {migrated_count} work experience records")

async def migrate_projects():
    """Migrate project records to add new fields"""
    print("🔄 Migrating project records...")
    
    # Find all project records that don't have the new fields
    projects = await MemberProject.find(
        {"project_type": {"$exists": False}}
    ).to_list()
    
    migrated_count = 0
    for project in projects:
        # Set default values for new fields
        project.project_type = None  # User can specify later
        project.tools = []           # Empty list of tools
        
        # If description exists, move it to responsibilities
        if hasattr(project, 'description') and project.description:
            project.responsibilities = project.description
            project.outcomes = None  # Leave outcomes empty for user to fill
        else:
            project.responsibilities = None
            project.outcomes = None
        
        await project.save()
        migrated_count += 1
    
    print(f"✅ Migrated {migrated_count} project records")

async def migrate_education():
    """Migrate education records to add GPA and rank fields"""
    print("🔄 Migrating education records...")
    
    # Find all education records that don't have the new fields
    educations = await MemberEducation.find(
        {"gpa": {"$exists": False}}
    ).to_list()
    
    migrated_count = 0
    for education in educations:
        # Set default values for new fields
        education.gpa = None    # User can add GPA later
        education.rank = None   # User can add rank later
        
        await education.save()
        migrated_count += 1
    
    print(f"✅ Migrated {migrated_count} education records")

async def verify_migration():
    """Verify that migration was successful"""
    print("🔍 Verifying migration...")
    
    # Count records with new fields
    work_with_responsibilities = await MemberWorkExperience.find(
        {"responsibilities": {"$exists": True}}
    ).count()
    
    projects_with_new_fields = await MemberProject.find(
        {"project_type": {"$exists": True}}
    ).count()
    
    education_with_new_fields = await MemberEducation.find(
        {"gpa": {"$exists": True}}
    ).count()
    
    total_work = await MemberWorkExperience.find({}).count()
    total_projects = await MemberProject.find({}).count()
    total_education = await MemberEducation.find({}).count()
    
    print(f"📊 Migration Results:")
    print(f"   Work Experience: {work_with_responsibilities}/{total_work} have responsibilities field")
    print(f"   Projects: {projects_with_new_fields}/{total_projects} have new fields")
    print(f"   Education: {education_with_new_fields}/{total_education} have new fields")

async def main():
    """Main migration function"""
    print("🚀 Starting Resume Fields Migration")
    print("=" * 50)
    
    try:
        # Initialize database connection
        await init_db()
        print("✅ Database connection established")
        
        # Run migrations
        await migrate_work_experience()
        await migrate_projects()
        await migrate_education()
        
        # Verify migration
        await verify_migration()
        
        print("=" * 50)
        print("✅ Migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
