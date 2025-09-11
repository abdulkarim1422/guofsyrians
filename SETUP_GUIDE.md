# Training Employment Platform - Setup & Usage Guide

## 🎯 Overview

This is a comprehensive web platform for job matching and resume management, featuring:

- **Enhanced Job Section**: City selection, nature of work, employment types
- **Advanced Resume Builder**: Structured work experience, projects, education with validation
- **Social Media Integration**: URL validation and platform recognition
- **Modern Tech Stack**: React frontend with FastAPI backend and MongoDB database

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **Python** (3.11 or higher) - [Download here](https://www.python.org/)
3. **Docker & Docker Compose** - [Download here](https://www.docker.com/)
4. **Git** - [Download here](https://git-scm.com/)

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
# Double-click start.bat or run in terminal:
start.bat
```

**Linux/Mac:**
```bash
# Make executable and run:
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd training-employment
```

#### 2. Setup Environment Files

**Backend (.env):**
```bash
cd backend
cp .env.example .env
# Edit .env with your settings (MongoDB URI, SMTP, etc.)
```

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
# Edit .env with API URLs
```

#### 3. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

#### 4. Start Services

**Database:**
```bash
# In project root
docker-compose up -d db
```

**Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8222
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 📱 Accessing the Application

- **Frontend**: http://localhost:5173 (or 5174 if 5173 is busy)
- **Backend API**: http://localhost:8222
- **API Documentation**: http://localhost:8222/docs
- **MongoDB**: localhost:27017

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```properties
# Database
MONGODB_URI=mongodb://localhost:27017/training_employment_dev

# JWT Authentication
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email Service (Optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
CORS_ALLOW_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Frontend (.env)
```properties
VITE_API_URL=http://localhost:8222
VITE_API_URL_FOR_AUTH=http://localhost:8222
```

## 🎨 New Features Implemented

### Job Section Enhancements ✅
- **City Dropdown**: Turkish cities + "Other" option
- **Nature of Work**: Administrative, Fieldwork, Remote, Technical
- **Employment Type**: Full-time, Part-time, Contract, Freelance, Internship

### Resume Section Enhancements ✅

#### Work Experience
- **Responsibilities**: Mandatory field (min 10 characters)
- **Achievements**: Optional field for quantifiable results
- **Date Validation**: Proper start/end date validation
- **Present Option**: Support for ongoing positions

#### Projects
- **Project Type**: Personal, Professional, Academic, Open Source, Freelance
- **Tools/Technologies**: Tag-based input with search
- **Role**: Member's role in the project
- **Responsibilities**: What the member did
- **Outcomes**: Results and achievements

#### Education
- **GPA**: Optional numeric input (0-4 scale)
- **Academic Honors**: Comprehensive dropdown with ranks

#### Social Media
- **URL Validation**: Sophisticated normalization for 15+ platforms
- **Helper Text**: Real-time guidance for users
- **Platform Recognition**: Auto-detection with icons

## 🗄️ Database Structure

### Collections

#### Jobs
```javascript
{
  title: String,
  company: String,
  description: String,
  location: String,
  city: String,              // NEW: Turkish cities + Other
  nature_of_work: String,    // NEW: administrative/fieldwork/remote/technical
  employment_type: String,   // ENHANCED: comprehensive options
  // ... other existing fields
}
```

#### Work Experience
```javascript
{
  member_id: String,
  job_title: String,
  company: String,
  responsibilities: String,   // NEW: Mandatory responsibilities
  achievements: String,      // NEW: Optional achievements
  start_date: Date,
  end_date: Date,
  description: String       // LEGACY: Kept for backward compatibility
}
```

#### Projects
```javascript
{
  member_id: String,
  project_name: String,
  project_type: String,      // NEW: Personal/Professional/etc.
  tools: [String],          // NEW: Technologies/tools array
  role: String,             // NEW: Member's role
  responsibilities: String,  // NEW: What member did
  outcomes: String,         // NEW: Results/achievements
  start_date: Date,
  end_date: Date,
  description: String       // LEGACY: Kept for backward compatibility
}
```

#### Education
```javascript
{
  member_id: String,
  institution: String,
  degree: String,
  field_of_study: String,
  gpa: Number,              // NEW: 0-4 scale
  rank: String,             // NEW: Academic honors
  start_date: Date,
  end_date: Date
}
```

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
python -m pytest tests/test_enhanced_resume.py -v
```

### Run Frontend Tests (if available)
```bash
cd frontend
npm test
```

### Manual Testing Checklist

#### Job Section ✅
- [ ] City dropdown displays Turkish cities + "Other"
- [ ] Nature of work dropdown functions correctly
- [ ] Employment type has all options
- [ ] Form validation works properly
- [ ] Data saves to database correctly

#### Work Experience ✅
- [ ] Responsibilities field is mandatory
- [ ] Achievements field is optional
- [ ] Date validation prevents invalid ranges
- [ ] "Present" option works for current positions
- [ ] Progress indicators show completion status

#### Projects ✅
- [ ] Project type dropdown works
- [ ] Tools field supports tag input with search
- [ ] Role field accepts text input
- [ ] Responsibilities and outcomes save properly
- [ ] Date validation logic functions correctly

#### Education ✅
- [ ] GPA field accepts 0-4 range
- [ ] Academic honors dropdown displays options
- [ ] Both fields are optional
- [ ] Existing functionality preserved

#### Social Media ✅
- [ ] URL validation works for various formats
- [ ] Helper text displays correctly
- [ ] Platform icons appear automatically
- [ ] Auto-completion functions properly

## 🔄 Database Migration

If you have existing data, run the migration script:

```bash
cd backend
python migrate_resume_fields.py
```

This will:
- Migrate work experience descriptions to responsibilities
- Add new fields to project records
- Add GPA/rank fields to education records
- Verify migration success

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill processes on specific ports
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5173 | xargs kill -9
```

#### MongoDB Connection Issues
```bash
# Check if MongoDB container is running
docker ps | grep mongo

# Restart MongoDB
docker-compose restart db

# Check MongoDB logs
docker-compose logs db
```

#### Python Module Errors
```bash
# Reinstall requirements
cd backend
pip install -r requirements.txt --force-reinstall
```

#### Frontend Build Errors
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Backend Import Errors
If you encounter import errors, make sure all Python dependencies are installed:

```bash
pip install fastapi beanie motor pydantic uvicorn python-multipart bcrypt python-jose passlib aiosmtplib email-validator python-dotenv requests
```

### Frontend Component Errors
If React components show import errors, check that imports use the correct syntax:

```javascript
// Default export
import ComponentName from './ComponentName';

// Named export  
import { ComponentName } from './ComponentName';
```

## 📚 API Documentation

Once the backend is running, visit http://localhost:8222/docs for interactive API documentation.

### Key Endpoints

- `POST /resume/submit` - Submit complete resume
- `GET /jobs` - List all jobs
- `POST /jobs` - Create new job (admin)
- `GET /member/{id}` - Get member profile
- `POST /member/{id}/work-experience` - Add work experience
- `POST /member/{id}/projects` - Add project
- `POST /member/{id}/education` - Add education

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues:

1. Check this README for troubleshooting steps
2. Review the console logs in browser/terminal
3. Check the GitHub issues page
4. Contact the development team

---

**Happy Coding! 🚀**
