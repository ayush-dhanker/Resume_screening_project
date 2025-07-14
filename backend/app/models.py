from pydantic import BaseModel, EmailStr, Field, AnyUrl
from typing import Annotated, List, Dict, Optional
from fastapi.responses import JSONResponse
from fastapi import UploadFile
from datetime import date


class Job(BaseModel):
    id: Annotated[int, Field(..., description="Unique identifier for the job")]
    title: Annotated[str, Field(..., description="Job title", max_length=100)]
    company: Annotated[str,
                       Field(..., description="Company name", max_length=50)]
    location: Annotated[str,
                        Field(..., description="Job location (e.g., Remote, Hybrid)")]
    salary: Annotated[str,
                      Field(..., description="Salary range (e.g., $100,000 - $150,000)")]
    description: Annotated[str,
                           Field(..., description="Detailed job description")]
    level: Annotated[str,
                     Field(..., description="Experience level (e.g., Senior, Mid-Level)")]
    skills: Annotated[List[str],
                      Field(..., description="List of required skills")]
    posted_date: Annotated[date,
                           Field(..., description="Date when the job was posted")]
    type: Annotated[str,
                    Field(..., description="Job type (e.g., Full-time, Contract)")]


class Applicant(BaseModel):
    name: Annotated[str, Field(..., description='Name of the Applicant')]
    experience: Annotated[int, Field(
        ..., ge=0, description="Experience (in years) of the applicant, must be 0 or more")]
    email: Annotated[EmailStr,
                     Field(..., description="Email adress of the applicant")]
    resume: Annotated[UploadFile,
                      Field(..., description='Resume file (PDF or DOCX)')]


class TeamMember(BaseModel):
    name: Annotated[str,
                    Field(..., description="Full name of the team member")]
    role: Annotated[str,
                    Field(..., description="Role in the team")]
    photo: Annotated[str,
                     Field(..., description="URL to the team member's photo")]
    linkedin: Annotated[AnyUrl, Field(..., description="LinkedIn profile URL")]
    github: Annotated[AnyUrl, Field(..., description="GitHub profile URL")]
