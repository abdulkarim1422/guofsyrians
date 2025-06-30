import asyncio
import os
from datetime import datetime, timezone
from models.member_model import Member, MemberEducation
from config.database import init_beanie
import motor.motor_asyncio

async def populate_dummy_members():
    # Initialize database connection
    # Use environment variable or fallback to docker service name
    mongodb_uri = os.getenv("MONGODB_URI", "mongodb://db:27017")
    client = motor.motor_asyncio.AsyncIOMotorClient(mongodb_uri)
    await init_beanie(database=client.guofsyrians_db, document_models=[Member, MemberEducation])
    
    # Clear existing members (optional)
    await Member.delete_all()
    await MemberEducation.delete_all()
    
    # Dummy members data
    dummy_members = [
        {
            "name": "Alice Johnson",
            "user_id": "user_001",
            "team_id": "team_001",
            "email": "alice.johnson@example.com",
            "phone": "+1234567890",
            "professional_title": "Software Engineer",
            "bio": "Passionate about AI and machine learning",
            "skills": ["Python", "JavaScript", "React", "MongoDB"],
            "interests": ["AI", "Web Development", "Data Science"],
            "social_media": {"linkedin": "alice-johnson", "github": "alicej"},
            "country": "USA",
            "city": "Boston"
        },
        {
            "name": "Bob Smith",
            "user_id": "user_002",
            "team_id": "team_001",
            "email": "bob.smith@example.com",
            "phone": "+1234567891",
            "professional_title": "Data Scientist",
            "bio": "Mathematics enthusiast with focus on statistical modeling",
            "skills": ["Python", "R", "Statistics", "Machine Learning"],
            "interests": ["Mathematics", "Statistics", "Data Analysis"],
            "social_media": {"linkedin": "bob-smith", "github": "bobsmith"},
            "country": "USA",
            "city": "Cambridge"
        },
        {
            "name": "Carol Williams",
            "user_id": "user_003",
            "team_id": "team_002",
            "email": "carol.williams@example.com",
            "phone": "+1234567892",
            "professional_title": "Physics Researcher",
            "bio": "Quantum physics researcher and educator",
            "skills": ["Physics", "Research", "MATLAB", "Python"],
            "interests": ["Quantum Physics", "Research", "Education"],
            "social_media": {"linkedin": "carol-williams"},
            "country": "USA",
            "city": "Palo Alto"
        },
        {
            "name": "David Brown",
            "user_id": "user_004",
            "team_id": "team_002",
            "email": "david.brown@example.com",
            "phone": "+1234567893",
            "professional_title": "Chemical Engineer",
            "bio": "Environmental chemistry specialist",
            "skills": ["Chemistry", "Environmental Science", "Research"],
            "interests": ["Environment", "Sustainability", "Chemistry"],
            "social_media": {"linkedin": "david-brown"},
            "country": "USA",
            "city": "Berkeley"
        },
        {
            "name": "Eva Davis",
            "user_id": "user_005",
            "team_id": "team_003",
            "email": "eva.davis@example.com",
            "phone": "+1234567894",
            "professional_title": "Biologist",
            "bio": "Marine biology researcher",
            "skills": ["Biology", "Research", "Marine Science"],
            "interests": ["Marine Life", "Conservation", "Research"],
            "social_media": {"linkedin": "eva-davis"},
            "country": "USA",
            "city": "Pasadena"
        },
        {
            "name": "Frank Miller",
            "user_id": "user_006",
            "team_id": "team_003",
            "email": "frank.miller@example.com",
            "phone": "+1234567895",
            "professional_title": "Literature Professor",
            "bio": "English literature scholar",
            "skills": ["Writing", "Literature Analysis", "Teaching"],
            "interests": ["Literature", "Writing", "Education"],
            "social_media": {"linkedin": "frank-miller"},
            "country": "USA",
            "city": "New Haven"
        },
        {
            "name": "Grace Wilson",
            "user_id": "user_007",
            "team_id": "team_004",
            "email": "grace.wilson@example.com",
            "phone": "+1234567896",
            "professional_title": "Historian",
            "bio": "Modern history researcher",
            "skills": ["History", "Research", "Writing"],
            "interests": ["History", "Culture", "Writing"],
            "social_media": {"linkedin": "grace-wilson"},
            "country": "USA",
            "city": "Princeton"
        },
        {
            "name": "Henry Moore",
            "user_id": "user_008",
            "team_id": "team_004",
            "email": "henry.moore@example.com",
            "phone": "+1234567897",
            "professional_title": "Art Historian",
            "bio": "Contemporary art specialist",
            "skills": ["Art History", "Curation", "Research"],
            "interests": ["Art", "Culture", "Museums"],
            "social_media": {"linkedin": "henry-moore"},
            "country": "USA",
            "city": "New York"
        },
        {
            "name": "Isabella Garcia",
            "user_id": "user_009",
            "team_id": "team_005",
            "email": "isabella.garcia@example.com",
            "phone": "+1234567898",
            "professional_title": "Economist",
            "bio": "Behavioral economics researcher",
            "skills": ["Economics", "Statistics", "Research"],
            "interests": ["Economics", "Policy", "Research"],
            "social_media": {"linkedin": "isabella-garcia"},
            "country": "USA",
            "city": "Chicago"
        },
        {
            "name": "ss",
            "user_id": "user_010",
            "team_id": "team_005",
            "email": "jack.thompson@example.com",
            "phone": "+1234567899",
            "professional_title": "Journalist",
            "bio": "Investigative journalist",
            "skills": ["Writing", "Research", "Communication"],
            "interests": ["Journalism", "Media", "Current Events"],
            "social_media": {"linkedin": "jack-thompson", "twitter": "jackthompson"},
            "country": "USA",
            "city": "Evanston"
        },
        {
            "name": "Katherine Lee",
            "user_id": "user_011",
            "team_id": "team_006",
            "email": "katherine.lee@example.com",
            "phone": "+1234567800",
            "professional_title": "Business Analyst",
            "bio": "Strategic business consultant",
            "skills": ["Business Analysis", "Strategy", "Finance"],
            "interests": ["Business", "Strategy", "Finance"],
            "social_media": {"linkedin": "katherine-lee"},
            "country": "USA",
            "city": "Philadelphia"
        },
        {
            "name": "Liam Rodriguez",
            "user_id": "user_012",
            "team_id": "team_006",
            "email": "liam.rodriguez@example.com",
            "phone": "+1234567801",
            "professional_title": "Mechanical Engineer",
            "bio": "Robotics and automation specialist",
            "skills": ["Mechanical Engineering", "Robotics", "CAD"],
            "interests": ["Robotics", "Automation", "Engineering"],
            "social_media": {"linkedin": "liam-rodriguez"},
            "country": "USA",
            "city": "Durham"
        },
        {
            "name": "Mia Anderson",
            "user_id": "user_013",
            "team_id": "team_007",
            "email": "mia.anderson@example.com",
            "phone": "+1234567802",
            "professional_title": "International Relations Specialist",
            "bio": "Global policy analyst",
            "skills": ["Policy Analysis", "International Relations", "Research"],
            "interests": ["Global Politics", "Policy", "Diplomacy"],
            "social_media": {"linkedin": "mia-anderson"},
            "country": "USA",
            "city": "Washington DC"
        },
        {
            "name": "Noah Martinez",
            "user_id": "user_014",
            "team_id": "team_007",
            "email": "noah.martinez@example.com",
            "phone": "+1234567803",
            "professional_title": "Medical Doctor",
            "bio": "Emergency medicine physician",
            "skills": ["Medicine", "Emergency Care", "Surgery"],
            "interests": ["Medicine", "Healthcare", "Emergency Response"],
            "social_media": {"linkedin": "noah-martinez"},
            "country": "USA",
            "city": "Nashville"
        },
        {
            "name": "Olivia Taylor",
            "user_id": "user_015",
            "team_id": "team_008",
            "email": "olivia.taylor@example.com",
            "phone": "+1234567804",
            "professional_title": "Clinical Psychologist",
            "bio": "Child and adolescent psychology specialist",
            "skills": ["Psychology", "Therapy", "Research"],
            "interests": ["Psychology", "Mental Health", "Child Development"],
            "social_media": {"linkedin": "olivia-taylor"},
            "country": "USA",
            "city": "Providence"
        },
        {
            "name": "Parker Wilson",
            "user_id": "user_016",
            "team_id": "team_008",
            "email": "parker.wilson@example.com",
            "phone": "+1234567805",
            "professional_title": "Agricultural Engineer",
            "bio": "Sustainable farming specialist",
            "skills": ["Agriculture", "Sustainability", "Engineering"],
            "interests": ["Farming", "Sustainability", "Environment"],
            "social_media": {"linkedin": "parker-wilson"},
            "country": "USA",
            "city": "Ithaca"
        },
        {
            "name": "Quinn Davis",
            "user_id": "user_017",
            "team_id": "team_009",
            "email": "quinn.davis@example.com",
            "phone": "+1234567806",
            "professional_title": "Architect",
            "bio": "Sustainable architecture designer",
            "skills": ["Architecture", "Design", "CAD", "Sustainability"],
            "interests": ["Architecture", "Design", "Environment"],
            "social_media": {"linkedin": "quinn-davis"},
            "country": "USA",
            "city": "Houston"
        },
        {
            "name": "Riley Johnson",
            "user_id": "user_018",
            "team_id": "team_009",
            "email": "riley.johnson@example.com",
            "phone": "+1234567807",
            "professional_title": "Environmental Scientist",
            "bio": "Climate change researcher",
            "skills": ["Environmental Science", "Climate Research", "Data Analysis"],
            "interests": ["Environment", "Climate", "Sustainability"],
            "social_media": {"linkedin": "riley-johnson"},
            "country": "USA",
            "city": "Atlanta"
        },
        {
            "name": "Sophia Chen",
            "user_id": "user_019",
            "team_id": "team_010",
            "email": "sophia.chen@example.com",
            "phone": "+1234567808",
            "professional_title": "Computer Engineer",
            "bio": "Hardware and software integration specialist",
            "skills": ["Computer Engineering", "Hardware", "Software"],
            "interests": ["Technology", "Innovation", "Engineering"],
            "social_media": {"linkedin": "sophia-chen", "github": "sophiachen"},
            "country": "USA",
            "city": "Pittsburgh"
        },
        {
            "name": "Tyler White",
            "user_id": "user_020",
            "team_id": "team_010",
            "email": "tyler.white@example.com",
            "phone": "+1234567809",
            "professional_title": "Political Scientist",
            "bio": "Public policy researcher",
            "skills": ["Political Science", "Policy Analysis", "Research"],
            "interests": ["Politics", "Policy", "Government"],
            "social_media": {"linkedin": "tyler-white"},
            "country": "USA",
            "city": "St. Louis"
        }
    ]

    # Education data corresponding to the original student data
    education_data = [
        {"user_id": "user_001", "institution": "Harvard University", "degree": "Doktora", "field_of_study": "Computer Science", "graduation_date": "2024-05-15"},
        {"user_id": "user_002", "institution": "MIT", "degree": "Lisans", "field_of_study": "Mathematics", "graduation_date": "2025-06-10"},
        {"user_id": "user_003", "institution": "Stanford University", "degree": "Graduate", "field_of_study": "Physics", "graduation_date": "2023-12-15"},
        {"user_id": "user_004", "institution": "UC Berkeley", "degree": "Yüksek Lisans", "field_of_study": "Chemistry", "graduation_date": "2026-05-20"},
        {"user_id": "user_005", "institution": "Caltech", "degree": "Doktora", "field_of_study": "Biology", "graduation_date": "2024-06-05"},
        {"user_id": "user_006", "institution": "Yale University", "degree": "Lisans", "field_of_study": "English Literature", "graduation_date": "2025-05-25"},
        {"user_id": "user_007", "institution": "Princeton University", "degree": "Graduate", "field_of_study": "History", "graduation_date": "2023-05-30"},
        {"user_id": "user_008", "institution": "Columbia University", "degree": "Ön Lisans", "field_of_study": "Art History", "graduation_date": "2027-05-15"},
        {"user_id": "user_009", "institution": "University of Chicago", "degree": "Lisans", "field_of_study": "Economics", "graduation_date": "2024-12-15"},
        {"user_id": "user_010", "institution": "Northwestern University", "degree": "Yüksek Lisans", "field_of_study": "Journalism", "graduation_date": "2025-08-20"},
        {"user_id": "user_011", "institution": "University of Pennsylvania", "degree": "Doktora", "field_of_study": "Business Administration", "graduation_date": "2026-03-10"},
        {"user_id": "user_012", "institution": "Duke University", "degree": "Lisans", "field_of_study": "Engineering", "graduation_date": "2024-08-15"},
        {"user_id": "user_013", "institution": "Georgetown University", "degree": "Graduate", "field_of_study": "International Relations", "graduation_date": "2023-10-20"},
        {"user_id": "user_014", "institution": "Vanderbilt University", "degree": "Doktora", "field_of_study": "Medicine", "graduation_date": "2027-06-30"},
        {"user_id": "user_015", "institution": "Brown University", "degree": "Yüksek Lisans", "field_of_study": "Psychology", "graduation_date": "2025-12-15"},
        {"user_id": "user_016", "institution": "Cornell University", "degree": "Lisans", "field_of_study": "Agriculture", "graduation_date": "2024-09-10"},
        {"user_id": "user_017", "institution": "Rice University", "degree": "Ön Lisans", "field_of_study": "Architecture", "graduation_date": "2026-07-25"},
        {"user_id": "user_018", "institution": "Emory University", "degree": "Graduate", "field_of_study": "Environmental Science", "graduation_date": "2023-11-30"},
        {"user_id": "user_019", "institution": "Carnegie Mellon University", "degree": "Doktora", "field_of_study": "Computer Engineering", "graduation_date": "2026-04-15"},
        {"user_id": "user_020", "institution": "Washington University", "degree": "Lisans", "field_of_study": "Political Science", "graduation_date": "2025-01-20"}
    ]

    # Insert members
    members = []
    for member_data in dummy_members:
        member = Member(**member_data)
        await member.insert()
        members.append(member)
        print(f"Created member: {member.name}")

    # Insert education data
    for edu_data in education_data:
        # Find the corresponding member
        member = await Member.find_one({"user_id": edu_data["user_id"]})
        if member:
            education = MemberEducation(
                member_id=str(member.id),
                institution=edu_data["institution"],
                degree=edu_data["degree"],
                field_of_study=edu_data["field_of_study"],
                end_date=datetime.strptime(edu_data["graduation_date"], "%Y-%m-%d")
            )
            await education.insert()
            print(f"Created education record for: {member.name}")

    print(f"Successfully created {len(members)} members with education data!")

if __name__ == "__main__":
    asyncio.run(populate_dummy_members())
