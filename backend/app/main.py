# from your_module import evaluate_resume  # Import your scoring function
from fastapi import FastAPI, UploadFile, File, Form
from typing import Dict
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import json
from fastapi import FastAPI, UploadFile, HTTPException, File, Form
from loadData import load_data, job_by_id
# from pydantic import BaseModel, EmailStr, Field, AnyUrl
from typing import Annotated, List, Dict, Optional
from fastapi.responses import JSONResponse
from datetime import date, datetime, timezone
from models import Job, Applicant, TeamMember
from fastapi.middleware.cors import CORSMiddleware
from backend.model import evaluate_resume

app = FastAPI()

origins = [
    "http://localhost:3000",
]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] to allow all
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


@app.get('/apply/{id}', response_model=Job)
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


@app.post("/apply/{id}")
async def submit_application(
    id: int,
    name: str = Form(...),
    job: str = Form(...),
    resume: UploadFile = File(...)
):
    try:
        job_data = json.loads(job)
    except json.JSONDecodeError:
        return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid job format"})

    # Read resume bytes
    resume_content = await resume.read()

    # Call your evaluate_resume function (which should accept bytes and job_data)
    result = evaluate_resume(resume_content, job_data)

    return JSONResponse(content=result)


# @app.post('/apply/{job_id}')
# async def submit_application(
#     # job_id: str,
#     name: str = Form(...),
#     job_description: str = Form(...),  # Receive as JSON string
#     resume: UploadFile = File(...)
# ) -> Dict:
#     """
#     Process job applications with resume scoring

#     Args:
#         job_id: Unique job posting ID
#         name: Applicant name
#         job_description: JSON string containing:
#             {
#                 "text": "job description text",
#                 "required_skills": ["Python", "SQL"],
#                 "education": {"min_degree": "Master"}
#             }
#         resume: Uploaded resume file (PDF/DOCX)

#     Returns:
#         Application evaluation results with match score
#     """
#     try:
#         # 1. Validate and parse job description
#         try:
#             job_data = json.loads(job_description)
#         except json.JSONDecodeError as e:
#             raise HTTPException(
#                 status_code=422,
#                 detail=f"Invalid job description format: {str(e)}"
#             )

#         # 2. Process resume file
#         if not resume.filename.lower().endswith(('.pdf', '.docx')):
#             raise HTTPException(
#                 status_code=400,
#                 detail="Only PDF and DOCX files are allowed"
#             )

#         resume_content = await resume.read()

#         # 3. Evaluate resume (implement your logic)
#         result = evaluate_resume(
#             resume_content=resume_content,
#             job_data=job_data
#         )

#         # 4. Format response
#         return json.load(result)
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"Processing failed: {str(e)}"
#         )
