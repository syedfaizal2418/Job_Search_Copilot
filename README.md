
# 🚀 Job Search Copilot

An AI-powered career copilot that streamlines job tracking and elevates application quality.

**Job Search Copilot** is a modern full-stack web application designed to help job seekers manage their recruitment journey from **Wishlist to Offer**. It combines an interactive drag-and-drop Kanban board with an intelligent AI Application Studio to simplify job descriptions, analyze ATS compatibility, and generate personalized application materials in seconds.

## ✨ Key Features

### 📌 Visual Kanban Tracking
- Manage job applications across 5 stages:
  - Wishlist
  - Applied
  - Interviewing
  - Offer
  - Rejected
- Smooth drag-and-drop functionality powered by `@hello-pangea/dnd`.

### 🔗 1-Click Job Import
- Automatically extract job details directly from job posting URLs.
- Scrape job titles, company names, and requirements using Cheerio.

### 📄 Smart Resume Parsing
- Upload and parse resumes in multiple formats:
  - PDF (`.pdf`)
  - Word (`.docx`)
  - Text (`.txt`)
- Extract relevant information for AI-powered analysis and personalization.

### 🤖 AI Application Studio — 6-in-1 AI Kit

Generate a personalized application toolkit for every job opportunity.

| Feature | Description |
|---|---|
| 📄 Tailored Cover Letter | Generates personalized 3–4 paragraph cover letters aligned with your profile and job requirements. |
| 🎯 Resume Bullet Optimization | Rewrites resume bullets using STAR/XYZ techniques with action-oriented, measurable achievements. |
| 💡 Interview Preparation | Generates 5 targeted behavioral and situational questions with recruiter rationale and answer blueprints. |
| 🏢 Company Executive Briefing | Provides company insights, culture signals, mission overview, and smart questions to ask during interviews. |
| 🔍 Job Description Simplifier | Converts complex job descriptions and technical jargon into easy-to-understand language. |
| 📊 ATS Compatibility Checker | Calculates a 0–100% compatibility score, identifies matched keywords, and highlights missing skills and gaps. |

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons

### Backend & Database
- Next.js API Routes
- SQLite
- Prisma ORM

### AI Integration
- OpenRouter API
- Claude 3.5 Sonnet / GPT-4o
- Structured JSON Schema responses

### File Processing & Web Scraping
- `pdf-parse` — PDF resume parsing
- `mammoth` — DOCX resume parsing
- `cheerio` — Job posting web scraping

## 🎯 Project Objective

To simplify the job application process by combining job tracking, resume optimization, interview preparation, and AI-driven career assistance into a single platform—helping job seekers apply smarter, stay organized, and improve their chances of landing the right opportunity.
