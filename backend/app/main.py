from fastapi import FastAPI, UploadFile, HTTPException
from loadData import load_data
# from pydantic import BaseModel, EmailStr, Field, AnyUrl
from typing import Annotated, List, Dict, Optional
from fastapi.responses import JSONResponse
from datetime import date, datetime, timezone
from models import Job, Applicant, TeamMember

app = FastAPI()

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


@app.get('/about', response_model=List[TeamMember])
def about_section():
    members = data["teamMembers"]
    if not members:
        raise HTTPException(status_code=404, detail="No Team Members Found")
    return JSONResponse(content=members, status_code=200)


# @app.post('/jobs/{id}')
# def add_applicant(applicant: Applicant):
#     # send the resume to the model

#     # can show this thing to new path
#     # if threshold satisfies

#         # i. add data and resume into db

#         # ii. send response

#     # If not

#         #i. send the reason
