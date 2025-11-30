The content is **excellent**! Just a few minor corrections:

```markdown
# Eunoia Virtual Pet - Contributor Setup Guide

## Project Overview
A mental health companion web app with animated virtual pet, mood tracking, and coping exercises.

**Tech Stack:**
- Frontend: React + TypeScript + Tailwind CSS + Vite
- Backend: Spring Boot + Java 21 + PostgreSQL
- Deployment: Vercel (Frontend) + Railway (Backend)

## Prerequisites
- **Node.js** 18+ [Download](https://nodejs.org/)
- **Java 21** [Download](https://adoptium.net/)
- **PostgreSQL** 15+ [Download](https://www.postgresql.org/download/)
- **Git** [Download](https://git-scm.com/)

## Quick Setup

### 1. Clone & Navigate
```bash
git clone https://github.com/draenor08/eunoia-virtual-pet.git
cd eunoia-virtual-pet
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 3. Backend Setup
```bash
cd ../backend
./mvnw spring-boot:run
```
Backend runs on: `http://localhost:8080`

**Note:** Backend will show database error initially - this is normal until PostgreSQL is configured.

## Development Workflow

### Branch Strategy
- `main` - Production code
- `develop` - Development branch
- `feature/feature-name` - Feature branches
- `hotfix/fix-name` - Emergency fixes

### Making Changes
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: descriptive commit message"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Convention
- `feat:` New features
- `fix:` Bug fixes  
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test-related changes

## Project Structure
```
eunoia-virtual-pet/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── features/        # Auth, Pet, Mood, Exercises
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript definitions
│   └── package.json
├── backend/                  # Spring Boot
│   ├── src/main/java/com/eunoia/virtualpet/
│   │   ├── controller/      # REST endpoints
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Data access
│   │   ├── model/           # Entities
│   │   └── config/          # Configuration
│   └── pom.xml
└── docs/                    # Documentation
```

## Environment Setup

### Frontend Dependencies
```bash
cd frontend
npm install  # Installs all dependencies
```

### Backend Dependencies
```bash
cd backend
./mvnw clean compile  # Downloads dependencies via Maven
```

### Database Setup (When Ready)
1. Install PostgreSQL
2. Create database: `eunoia_pet`
3. Update `backend/src/main/resources/application.properties`

## Common Issues & Solutions

### Frontend Won't Start
- Clear node_modules: `rm -rf node_modules && npm install` (Linux/Mac) or `Remove-Item -Recurse -Force node_modules && npm install` (Windows)
- Check Node version: `node --version` (should be 18+)

### Backend Database Error
- This is normal initially - PostgreSQL setup pending
- To test without DB, use the exclude configuration in application.properties

### Port Already in Use
- Frontend: Change port in `vite.config.ts`
- Backend: Change `server.port` in `application.properties`

## Getting Help
1. Check existing GitHub issues
2. Create new issue with:
   - Error messages
   - Steps to reproduce
   - Your environment (OS, Node/Java versions)

## Useful Commands
```bash
# Frontend testing
npm run test

# Backend testing  
./mvnw test

# Build for production
npm run build  # Frontend
./mvnw package # Backend
```

## Code Standards
- **Frontend**: TypeScript strict mode, Tailwind CSS, functional components with hooks
- **Backend**: Spring Boot conventions, meaningful variable names, service layer separation
- **Git**: Descriptive commit messages, feature branches, PR reviews required

---
*Last updated: 30th November 2025*
```