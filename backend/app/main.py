from fastapi import FastAPI, UploadFile, HTTPException
from loadData import load_data, job_by_id
# from pydantic import BaseModel, EmailStr, Field, AnyUrl
from typing import Annotated, List, Dict, Optional
from fastapi.responses import JSONResponse
from datetime import date, datetime, timezone
from models import Job, Applicant, TeamMember
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

origins = [
    "http://localhost:3000",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data = load_data()

MODEL_VERSION = "1.0.0"


@app.get('/', )
def hello():
    return {'message': "hello"}


@app.get('/home', )
def hello():
    return {'message': "HCAI Project work"}


@app.get('/health')
def health_check():
    return JSONResponse(
        content={
            "status": "ok",
            "message": "The API is up and running!",
            "model_version": MODEL_VERSION,
            "checked_at": datetime.now(timezone.utc).isoformat()
        },
        status_code=200
    )


@app.get('/jobs', response_model=List[Job])
def listed_jobs():
    jobs = data["jobs"]
    if not jobs:
        raise HTTPException(
            status_code=404, detail="No Jobs Found at the moment")
    return JSONResponse(content=jobs, status_code=200)


@app.get('/jobs/{id}', response_model=Job)
def get_job_by_id(id: int):
    jobs = data["jobs"]

    for job in jobs:
        if job["id"] == id:
            return JSONResponse(content=job, status_code=200)

    raise HTTPException(
        status_code=404,
        detail=f"Job with ID {id} not found"
    )


@app.get('/about', response_model=List[TeamMember])
def about_section():
    members = data["teamMembers"]
    if not members:
        raise HTTPException(status_code=404, detail="No Team Members Found")
    return JSONResponse(content=members, status_code=200)


@app.post('/jobs/{id}')
async def submit_application(
    name: str = Form(...),
    job: str = Form(...),  # JSON stringified object from frontend
    resume: UploadFile = File(...)
):
    resume_content = await resume.read()

    # Parse the job JSON
    try:
        job_data = json.loads(job)
    except json.JSONDecodeError:
        return {"error": "Invalid job format"}

    job_text = job_data.get("text", "")
    required_skills = job_data.get("required_skills", [])
    education = job_data.get("education", {})

    # Call your evaluation function
    match_score = evaluate_resume(
        resume_content.decode(), job_text, required_skills, education)

    return {
        "message": "Application submitted",
        "match_score": match_score,
        "applicant": {
            "name": name
        }
    }
