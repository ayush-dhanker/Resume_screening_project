
from fastapi import FastAPI, UploadFile, File, Form
from typing import Dict
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import json
from fastapi import FastAPI, UploadFile, HTTPException, File, Form
from loadData import load_data, job_by_id

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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

    content = await resume.read()
    filename = resume.filename
    result = evaluate_resume(content, filename, job_data)

    return JSONResponse(content=result)
